import { describe, expect, it } from "vitest";

const openAiApiKey = process.env.OPENAI_API_KEY;
const supabaseUrl = process.env.CSNOEL_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.CSNOEL_SUPABASE_SERVICE_ROLE_KEY;

describe("server integration credentials", () => {
  it("can authenticate with OpenAI and access public and protected CSNoel Supabase tables", async () => {
    expect(openAiApiKey).toBeTruthy();
    expect(supabaseUrl).toMatch(/^https:\/\//);
    expect(supabaseServiceRoleKey).toBeTruthy();

    const [openAiResponse, publicJobsResponse, protectedApplicationsResponse] = await Promise.all([
      fetch("https://api.openai.com/v1/models", {
        headers: { Authorization: `Bearer ${openAiApiKey}` },
      }),
      fetch(`${supabaseUrl}/rest/v1/jobs?select=id&limit=1`, {
        headers: {
          apikey: supabaseServiceRoleKey!,
          Authorization: `Bearer ${supabaseServiceRoleKey}`,
        },
      }),
      fetch(`${supabaseUrl}/rest/v1/applications?select=id&limit=1`, {
        headers: {
          apikey: supabaseServiceRoleKey!,
          Authorization: `Bearer ${supabaseServiceRoleKey}`,
        },
      }),
    ]);

    expect(openAiResponse.ok).toBe(true);
    expect(publicJobsResponse.ok).toBe(true);
    expect(protectedApplicationsResponse.ok).toBe(true);
  }, 20_000);
});
