function requiredEnvironment(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required server environment variable: ${name}`);
  }
  return value;
}

export const CSNOEL_CONFIG = {
  openAiApiKey: requiredEnvironment("OPENAI_API_KEY"),
  openAiModel: process.env.CSNOEL_OPENAI_MODEL ?? "gpt-5.4-mini",
  supabaseUrl: requiredEnvironment("CSNOEL_SUPABASE_URL"),
  supabaseServiceRoleKey: requiredEnvironment("CSNOEL_SUPABASE_SERVICE_ROLE_KEY"),
  resumeBucket: "resumes",
  resumeMaxBytes: 10 * 1024 * 1024,
  uploadExpirySeconds: 300,
  signedDownloadExpirySeconds: 120,
} as const;
