import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { supabase } from "../supabase";

export type CSNoelAuthenticatedUser = {
  id: string;
  email: string | null;
  name: string | null;
  role: "admin" | "user";
};

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: CSNoelAuthenticatedUser | null;
};

export function getBearerToken(authorization?: string): string | null {
  const match = authorization?.match(/^Bearer\s+(.+)$/i);
  return match?.[1]?.trim() || null;
}

async function authenticateSupabaseRequest(accessToken: string): Promise<CSNoelAuthenticatedUser | null> {
  const { data, error } = await supabase.auth.getUser(accessToken);
  if (error || !data.user) return null;

  const { data: rawProfile, error: profileError } = await supabase
    .from("admin_profiles")
    .select("role")
    .eq("user_id", data.user.id)
    .maybeSingle();

  if (profileError) throw profileError;
  const profile = rawProfile as { role: "admin" | "user" } | null;

  const rawName = data.user.user_metadata?.full_name ?? data.user.user_metadata?.name;
  return {
    id: data.user.id,
    email: data.user.email ?? null,
    name: typeof rawName === "string" ? rawName : null,
    role: profile?.role === "admin" ? "admin" : "user",
  };
}

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  const accessToken = getBearerToken(opts.req.header("authorization"));
  let user: CSNoelAuthenticatedUser | null = null;

  if (accessToken) {
    try {
      user = await authenticateSupabaseRequest(accessToken);
    } catch {
      // Public procedures remain available if a supplied credential is expired or invalid.
      user = null;
    }
  }

  return { req: opts.req, res: opts.res, user };
}
