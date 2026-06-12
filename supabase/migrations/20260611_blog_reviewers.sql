-- Perfil do revisor médico exibido no post publicado (autoria & revisão).
-- Problema: o autor do post era fixo "Dra. Jane" (hardcoded no prompt do Gerador),
-- então todo post mostrava Jane independentemente de quem aprovasse no editor.
-- Solução: mapa email -> dados do autor; o Publicador sobrescreve content.author
-- pelo revisor que aprovou (blog_drafts.reviewer_user_id -> auth.users.email -> aqui).
-- Chave por EMAIL (não user_id) para semear ANTES da conta existir (magic-link auto-cria no 1º login).
-- Aplicado via Supabase MCP apply_migration em 2026-06-11.

CREATE TABLE IF NOT EXISTS public.blog_reviewers (
  email      TEXT PRIMARY KEY,
  name       TEXT NOT NULL,
  crm        TEXT,
  rqe        TEXT,
  photo      TEXT,
  bio        TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.blog_reviewers ENABLE ROW LEVEL SECURITY;

-- Editor (authenticated) pode ler para exibir no futuro; escrita só via postgres/seed.
DROP POLICY IF EXISTS blog_reviewers_select_authenticated ON public.blog_reviewers;
CREATE POLICY blog_reviewers_select_authenticated ON public.blog_reviewers
  FOR SELECT TO authenticated USING (true);

-- Resolve o autor (BlogAuthor JSON) a partir do user_id do revisor que aprovou.
-- SECURITY DEFINER: roda como owner (postgres) -> não depende do privilégio do
-- papel do n8n sobre o schema auth, e ignora RLS de blog_reviewers.
-- Retorna NULL quando não há revisor mapeado (Publicador mantém o autor da IA = fallback).
CREATE OR REPLACE FUNCTION public.reviewer_author_for_user(p_user_id UUID)
RETURNS JSONB
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, auth
AS $$
  SELECT jsonb_strip_nulls(jsonb_build_object(
           'name',  r.name,
           'crm',   r.crm,
           'rqe',   r.rqe,
           'photo', r.photo,
           'bio',   r.bio
         ))
  FROM auth.users u
  JOIN public.blog_reviewers r ON lower(r.email) = lower(u.email)
  WHERE u.id = p_user_id
  LIMIT 1;
$$;

GRANT EXECUTE ON FUNCTION public.reviewer_author_for_user(UUID)
  TO postgres, authenticated, service_role;

-- Seed: revisores atuais. Bio/credenciais espelham o que já aparece nos posts e no site.
INSERT INTO public.blog_reviewers (email, name, crm, rqe, photo, bio) VALUES
  ('erikafrazao@gmail.com',
   'Dra. Jane Erika Frazão Okazaki',
   'CRM-PE 19872', 'RQE 17633', '/assets/team/jane.webp',
   'Médica geriatra do Centro Clínico Okazaki, responsável pela revisão clínica do conteúdo deste blog.'),
  ('anabiasacerdote@gmail.com',
   'Dra. Ana Beatriz Sacerdote',
   'CRM-PE 19243', 'RQE 3381', '/assets/team/anabeatriz.webp',
   'Médica gastroenterologista e hepatologista do Centro Clínico Okazaki, responsável pela revisão clínica do conteúdo deste blog.')
ON CONFLICT (email) DO UPDATE SET
  name = EXCLUDED.name, crm = EXCLUDED.crm, rqe = EXCLUDED.rqe,
  photo = EXCLUDED.photo, bio = EXCLUDED.bio;
