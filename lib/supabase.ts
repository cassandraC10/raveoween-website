/**
 * Integration boundary for the future community phase (Supabase Auth + Postgres).
 * NOTHING in the public site imports this yet. It is env-gated and returns null when unconfigured,
 * so builds never require Supabase credentials.
 *
 * Rules for the community phase (from the Product Discovery Pack):
 *  - Authorisation is enforced server-side and by RLS policies; client flags are never authorisation.
 *  - Age verification (21+) is computed server-side, kept separate from membership approval.
 *  - Do not persist raw DOB, ID numbers or ID images. Service-role key stays server-only.
 */
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export function getSupabaseBrowserClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return null;
  return createClient(url, anon);
}
