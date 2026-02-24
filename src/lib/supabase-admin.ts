import { createClient } from "@supabase/supabase-js";

// Cliente server-side con service_role — NUNCA exportar al bundle del cliente.
// Solo usar en Route Handlers y Server Actions.
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);
