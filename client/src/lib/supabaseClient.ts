import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_CSNOEL_SUPABASE_URL;
const supabasePublishableKey = import.meta.env.VITE_CSNOEL_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabasePublishableKey) {
  throw new Error("CSNoel Supabase browser configuration is missing.");
}

export const supabaseClient = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});
