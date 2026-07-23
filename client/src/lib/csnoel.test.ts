import { describe, expect, it } from "vitest";
import { JOB_TYPES, formatJobType, getJobTypeTone } from "./csnoel";

describe("CSNoel public job-board contract", () => {
  it("exposes the exact supported healthcare staffing job types", () => {
    expect(JOB_TYPES).toEqual(["Travel", "LTC", "Rapid Response", "Per Diem"]);
  });

  it("keeps job-type labels and visual states available to the public interface", () => {
    expect(formatJobType("LTC")).toBe("LTC");
    expect(getJobTypeTone("Rapid Response")).toContain("amber");
    expect(getJobTypeTone("Per Diem")).toContain("violet");
  });
});
