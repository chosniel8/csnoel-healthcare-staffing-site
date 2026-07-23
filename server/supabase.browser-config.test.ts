import { describe, expect, it } from "vitest";

describe("browser Supabase configuration", () => {
  it("uses a configured publishable key that can read the Auth settings endpoint", async () => {
    const url = process.env.VITE_CSNOEL_SUPABASE_URL;
    const publishableKey = process.env.VITE_CSNOEL_SUPABASE_ANON_KEY;

    expect(url).toMatch(/^https:\/\/[a-z0-9-]+\.supabase\.co$/);
    expect(publishableKey).toMatch(/^(sb_publishable_|eyJ)/);

    const response = await fetch(`${url}/auth/v1/settings`, {
      headers: { apikey: publishableKey! },
    });

    expect(response.ok).toBe(true);
  }, 15_000);
});
