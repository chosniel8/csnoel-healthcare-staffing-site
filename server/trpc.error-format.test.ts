import { describe, expect, it } from "vitest";
import handler from "../netlify/functions/api";

describe("tRPC error responses", () => {
  it("does not expose a server stack trace through the Netlify API", async () => {
    const response = await handler(
      new Request(
        "https://preview.example.test/api/trpc/admin.jobs?input=%7B%22json%22%3Anull%7D",
      ),
      {} as never,
    );

    const body = await response.json();
    const error = body as {
      error?: { json?: { data?: Record<string, unknown> } };
    };

    expect(response.status).toBe(403);
    expect(error.error?.json?.data?.stack).toBeUndefined();
  });
});
