import { supabaseClient } from "@/lib/supabaseClient";

/**
 * Sends a passwordless sign-in link for the protected CSNoel administrator area.
 * The server still decides whether the authenticated identity has the admin role.
 */
export async function sendMagicLink(email: string) {
  const redirectTo = `${window.location.origin}/admin`;
  const { error } = await supabaseClient.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: redirectTo },
  });

  if (error) throw error;
}
