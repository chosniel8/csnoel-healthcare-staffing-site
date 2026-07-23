import { createClient } from "@supabase/supabase-js";
import { CSNOEL_CONFIG } from "./csnoelConfig";
import type { CSNoelDatabase } from "./csnoelDatabase";

export const supabase = createClient<CSNoelDatabase>(
  CSNOEL_CONFIG.supabaseUrl,
  CSNOEL_CONFIG.supabaseServiceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  },
);
