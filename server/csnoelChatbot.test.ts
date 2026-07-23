import { describe, expect, it, vi } from "vitest";

vi.mock("./csnoelServices", () => ({
  createLead: vi.fn(async () => ({ success: true, leadId: "3e811c5f-34e1-4b4a-a0af-4db86057e340" })),
  getPublicJob: vi.fn(),
  listPublicJobs: vi.fn(),
}));

import { CHATBOT_TOOLS, executeChatTool, redactConversationContent } from "./csnoelChatbot";

describe("CSNoel Responses API tool contract", () => {
  it("exposes exactly the agreed staffing tool names", () => {
    expect(CHATBOT_TOOLS.map(tool => tool.name)).toEqual([
      "search_jobs",
      "get_job_details",
      "submit_lead",
    ]);
  });

  it("refuses lead capture without explicit contact consent", async () => {
    const result = await executeChatTool(
      "submit_lead",
      JSON.stringify({
        name: "Taylor Jordan",
        email: "taylor@example.com",
        type: "clinician",
        confirmed_consent: false,
      }),
    );
    expect(result).toMatchObject({ ok: false });
  });

  it("rejects unknown tool names rather than executing arbitrary actions", async () => {
    const result = await executeChatTool("delete_all_jobs", "{}");
    expect(result).toEqual({ ok: false, error: "This tool is not available." });
  });

  it("redacts direct identifiers before a conversation message is persisted", () => {
    const persisted = redactConversationContent(
      "My email is jordan@example.com, phone is 555-123-4567, and SSN is 123-45-6789.",
    );
    expect(persisted).not.toContain("jordan@example.com");
    expect(persisted).not.toContain("555-123-4567");
    expect(persisted).not.toContain("123-45-6789");
  });
});
