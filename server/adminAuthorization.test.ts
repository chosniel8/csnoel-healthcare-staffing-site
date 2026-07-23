import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createStandardUserContext(): TrpcContext {
  return {
    user: {
      id: 42,
      openId: "standard-user",
      email: "user@example.com",
      name: "Standard User",
      loginMethod: "manus",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("CSNoel admin authorization", () => {
  it("rejects staffing administration requests from authenticated non-admin users", async () => {
    const caller = appRouter.createCaller(createStandardUserContext());
    await expect(caller.admin.jobs()).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
});
