import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const FALLBACK = 'https://www.clinicaokazaki.com';

const supabase = createClient(
  process.env.SUPABASE_URL ?? '',
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
  { auth: { autoRefreshToken: false, persistSession: false } },
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const slugParam = req.query.slug;
  const slug = (Array.isArray(slugParam) ? slugParam[0] : slugParam || '')
    .toLowerCase()
    .trim();

  if (!slug) return res.redirect(302, FALLBACK);

  try {
    const { data: campaign, error } = await supabase
      .from('qr_campaigns')
      .select('id, destination_url, active')
      .eq('slug', slug)
      .maybeSingle();

    if (error || !campaign || !campaign.active) {
      if (error) console.error('[qr] lookup error', error);
      return res.redirect(302, FALLBACK);
    }

    const ua = (req.headers['user-agent'] as string) || null;
    const fwd = (req.headers['x-forwarded-for'] as string | undefined)
      ?.split(',')[0]
      ?.trim();
    const ip = fwd || ((req.headers['x-real-ip'] as string) ?? null);
    const referrer = (req.headers.referer as string) || null;
    const deviceType = ua
      ? /Mobile|Android|iPhone|iPad|iPod/i.test(ua)
        ? 'mobile'
        : 'desktop'
      : 'unknown';
    const country = (req.headers['x-vercel-ip-country'] as string) || null;
    const cityRaw = req.headers['x-vercel-ip-city'] as string | undefined;
    const city = cityRaw ? decodeURIComponent(cityRaw) : null;

    // fire-and-forget: não bloqueia o redirect
    void supabase
      .from('qr_scans')
      .insert({
        campaign_id: campaign.id,
        campaign_slug: slug,
        user_agent: ua,
        ip_address: ip,
        device_type: deviceType,
        referrer,
        country,
        city,
      })
      .then((r: { error: unknown }) => {
        if (r.error) console.error('[qr] insert error', r.error);
      });

    return res.redirect(302, campaign.destination_url);
  } catch (err) {
    console.error('[qr] unexpected', err);
    return res.redirect(302, FALLBACK);
  }
}
