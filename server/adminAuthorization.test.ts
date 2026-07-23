import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import { describe, expect, it } from "vitest";

function createStandardUserContext(): TrpcContext {
  return {
    user: {
      id: "2c0f344e-bb50-4600-8138-fc49ef65dcf3",
      email: "user@example.com",
      name: "Standard User",
      role: "user",
    },
    req: { headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("CSNoel admin authorization", () => {
  it("rejects staffing administration requests from authenticated non-admin users", async () => {
    const caller = appRouter.createCaller(createStandardUserContext());
    await expect(caller.admin.jobs()).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
});
