import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import { describe, expect, it } from "vitest";

function createAuthContext(): TrpcContext {
  return {
    user: {
      id: "2c0f344e-bb50-4600-8138-fc49ef65dcf3",
      email: "sample@example.com",
      name: "Sample User",
      role: "user",
    },
    req: { headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("auth.logout", () => {
  it("acknowledges sign-out because the Supabase client clears its own session", async () => {
    const caller = appRouter.createCaller(createAuthContext());
    await expect(caller.auth.logout()).resolves.toEqual({ success: true });
  });
});
