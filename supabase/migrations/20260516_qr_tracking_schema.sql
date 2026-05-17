-- =====================================================
-- Migration: QR Code Tracking System
-- Projeto: Centro Clínico Okazaki
-- Aplicada em: 2026-05-16 via Supabase MCP
-- =====================================================

-- Tabela 1: catálogo de campanhas (QRs ativos)
CREATE TABLE IF NOT EXISTS qr_campaigns (
  id BIGSERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  destination_url TEXT NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

COMMENT ON TABLE qr_campaigns IS 'Catálogo de QR codes ativos da clínica. Cada linha = uma peça física diferente.';
COMMENT ON COLUMN qr_campaigns.slug IS 'Identificador na URL: clinicaokazaki.com/q/{slug}. Use lowercase, sem espaços, com hífens.';
COMMENT ON COLUMN qr_campaigns.destination_url IS 'URL completa para onde o scan redireciona (wa.me, site, landing).';
COMMENT ON COLUMN qr_campaigns.active IS 'Se FALSE, scans são redirecionados para clinicaokazaki.com (fallback).';

CREATE INDEX IF NOT EXISTS idx_qr_campaigns_slug ON qr_campaigns(slug);
CREATE INDEX IF NOT EXISTS idx_qr_campaigns_active ON qr_campaigns(active);

-- Tabela 2: log de cada scan
CREATE TABLE IF NOT EXISTS qr_scans (
  id BIGSERIAL PRIMARY KEY,
  campaign_id BIGINT REFERENCES qr_campaigns(id) ON DELETE SET NULL,
  campaign_slug TEXT NOT NULL,
  user_agent TEXT,
  ip_address TEXT,
  device_type TEXT,
  referrer TEXT,
  country TEXT,
  city TEXT,
  scanned_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

COMMENT ON TABLE qr_scans IS 'Log de cada scan/clique em QR codes. Append-only, nunca atualizar.';

CREATE INDEX IF NOT EXISTS idx_qr_scans_campaign_slug ON qr_scans(campaign_slug);
CREATE INDEX IF NOT EXISTS idx_qr_scans_scanned_at ON qr_scans(scanned_at DESC);
CREATE INDEX IF NOT EXISTS idx_qr_scans_campaign_date ON qr_scans(campaign_slug, scanned_at DESC);

-- Trigger updated_at
CREATE OR REPLACE FUNCTION update_qr_campaigns_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_qr_campaigns_updated_at ON qr_campaigns;
CREATE TRIGGER trg_qr_campaigns_updated_at
  BEFORE UPDATE ON qr_campaigns
  FOR EACH ROW
  EXECUTE FUNCTION update_qr_campaigns_updated_at();

-- View: scans agregados por dia
CREATE OR REPLACE VIEW qr_scans_daily AS
SELECT
  campaign_slug,
  DATE(scanned_at AT TIME ZONE 'America/Recife') as scan_date,
  COUNT(*) as total_scans,
  COUNT(*) FILTER (WHERE device_type = 'mobile') as mobile_scans,
  COUNT(*) FILTER (WHERE device_type = 'desktop') as desktop_scans,
  COUNT(DISTINCT ip_address) as unique_ips
FROM qr_scans
GROUP BY campaign_slug, DATE(scanned_at AT TIME ZONE 'America/Recife');

-- View: resumo por campanha
CREATE OR REPLACE VIEW qr_campaigns_summary AS
SELECT
  c.id,
  c.slug,
  c.name,
  c.active,
  c.created_at,
  COALESCE(s.total_scans, 0) as total_scans,
  COALESCE(s.unique_ips, 0) as unique_visitors,
  s.last_scan_at
FROM qr_campaigns c
LEFT JOIN (
  SELECT
    campaign_slug,
    COUNT(*) as total_scans,
    COUNT(DISTINCT ip_address) as unique_ips,
    MAX(scanned_at) as last_scan_at
  FROM qr_scans
  GROUP BY campaign_slug
) s ON s.campaign_slug = c.slug;

-- RLS: bloquear leitura pública (só service_role acessa)
ALTER TABLE qr_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE qr_scans ENABLE ROW LEVEL SECURITY;

-- Seed: primeira campanha
INSERT INTO qr_campaigns (slug, name, description, destination_url, notes) VALUES (
  'clube17',
  'Painel Clube 17 - Academia',
  'Painel publicitário 1,80m x 1,00m localizado no jardim do Clubinho do Clube 17, entrada da academia pelo estacionamento.',
  'https://wa.me/5581999540570?text=Ol%C3%A1!%20Vim%20pelo%20painel%20do%20Clube%2017%20e%20gostaria%20de%20agendar%20um%20exame.',
  'Contrato C Dezessete LTDA - vigência 6 meses a partir de 15/05/2026. Valor R$1.200/mês.'
) ON CONFLICT (slug) DO NOTHING;
