import { describe, expect, it } from "vitest";
import { createContext, getBearerToken } from "./_core/context";

describe("Supabase Auth request context", () => {
  it("parses only a valid Bearer authorization value", () => {
    expect(getBearerToken("Bearer secure-token")).toBe("secure-token");
    expect(getBearerToken("bearer   secure-token ")).toBe("secure-token");
    expect(getBearerToken("Basic secure-token")).toBeNull();
    expect(getBearerToken(undefined)).toBeNull();
  });

  it("creates an anonymous context when no access token is supplied", async () => {
    const context = await createContext({
      req: { header: () => undefined } as never,
      res: {} as never,
    });

    expect(context.user).toBeNull();
  });
});
