import { createClient } from '@supabase/supabase-js';

// Server-only. Importar APENAS dentro de packages/site/api/*.
// Usa service_role key — NUNCA expor ao cliente.
export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } },
);
