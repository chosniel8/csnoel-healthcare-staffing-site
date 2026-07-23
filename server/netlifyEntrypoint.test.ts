import { describe, expect, it } from "vitest";
import { handler } from "../netlify/functions/api";

describe("Netlify API entrypoint", () => {
  it("exports a serverless handler for the shared Express application", () => {
    expect(typeof handler).toBe("function");
  });
});
