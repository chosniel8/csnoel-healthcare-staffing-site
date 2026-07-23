import { describe, expect, it } from "vitest";
import {
  applicationSubmissionSchema,
  chatLeadSchema,
  jobTypeSchema,
  resumeUploadRequestSchema,
} from "./csnoelModels";

describe("CSNoel backend validation contracts", () => {
  it("accepts only the four agreed job types", () => {
    expect(jobTypeSchema.safeParse("Travel").success).toBe(true);
    expect(jobTypeSchema.safeParse("LTC").success).toBe(true);
    expect(jobTypeSchema.safeParse("Rapid Response").success).toBe(true);
    expect(jobTypeSchema.safeParse("Per Diem").success).toBe(true);
    expect(jobTypeSchema.safeParse("Contract").success).toBe(false);
  });

  it("rejects a resume upload that exceeds the private-upload size limit", () => {
    const parsed = resumeUploadRequestSchema.safeParse({
      jobId: "b0e517f4-0820-4d3a-b46b-69a9ee8ac300",
      fileName: "candidate.pdf",
      mimeType: "application/pdf",
      sizeBytes: 10 * 1024 * 1024 + 1,
    });
    expect(parsed.success).toBe(false);
  });

  it("requires a valid application payload and one-time upload token", () => {
    const parsed = applicationSubmissionSchema.safeParse({
      jobId: "b0e517f4-0820-4d3a-b46b-69a9ee8ac300",
      applicantName: "Alex Taylor",
      applicantEmail: "alex@example.com",
      applicantPhone: "555-0100",
      uploadToken: "not-a-uuid",
    });
    expect(parsed.success).toBe(false);
  });

  it("requires an explicit clinician or facility lead type", () => {
    expect(
      chatLeadSchema.safeParse({
        name: "Morgan Lee",
        email: "morgan@example.com",
        type: "facility",
      }).success,
    ).toBe(true);
    expect(
      chatLeadSchema.safeParse({
        name: "Morgan Lee",
        email: "morgan@example.com",
        type: "other",
      }).success,
    ).toBe(false);
  });
});
