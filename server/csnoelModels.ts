import { z } from "zod";

export const JOB_TYPES = ["Travel", "LTC", "Rapid Response", "Per Diem"] as const;
export const JOB_STATUSES = ["active", "inactive"] as const;
export const APPLICATION_STATUSES = ["pending", "reviewing", "interviewing", "placed", "rejected", "withdrawn"] as const;
export const LEAD_STATUSES = ["new", "contacted", "qualified", "closed"] as const;
export const RESUME_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
] as const;

export const jobTypeSchema = z.enum(JOB_TYPES);
export const emailSchema = z.string().trim().email().max(320);
export const phoneSchema = z.string().trim().max(40).optional().or(z.literal(""));
export const nonEmptyTextSchema = z.string().trim().min(1).max(8_000);

export const publicJobFiltersSchema = z.object({
  specialty: z.string().trim().max(120).optional(),
  location: z.string().trim().max(160).optional(),
  type: jobTypeSchema.optional(),
});

export const jobIdSchema = z.string().uuid();

export const applicationSubmissionSchema = z.object({
  jobId: jobIdSchema,
  applicantName: z.string().trim().min(2).max(160),
  applicantEmail: emailSchema,
  applicantPhone: phoneSchema,
  uploadToken: z.string().uuid(),
});

export const facilityInquirySchema = z.object({
  contactName: z.string().trim().min(2).max(160),
  email: emailSchema,
  phone: phoneSchema,
  organization: z.string().trim().min(2).max(180),
  message: z.string().trim().min(10).max(4_000),
});

export const resumeUploadRequestSchema = z.object({
  jobId: jobIdSchema,
  fileName: z.string().trim().min(1).max(180),
  mimeType: z.enum(RESUME_MIME_TYPES),
  sizeBytes: z.number().int().positive().max(10 * 1024 * 1024),
});

export const chatLeadSchema = z.object({
  name: z.string().trim().min(2).max(160),
  email: emailSchema,
  phone: phoneSchema,
  type: z.enum(["clinician", "facility"]),
  message: z.string().trim().max(4_000).optional(),
});

export const chatRequestSchema = z.object({
  conversationId: z.string().uuid().optional(),
  message: z.string().trim().min(1).max(2_000),
});

export const adminJobInputSchema = z.object({
  title: z.string().trim().min(2).max(180),
  location: z.string().trim().min(2).max(160),
  type: jobTypeSchema,
  specialty: z.string().trim().min(2).max(120),
  description: z.string().trim().min(20).max(12_000),
  salaryRange: z.string().trim().max(160).optional().or(z.literal("")),
  requirements: z.array(z.string().trim().min(1).max(400)).max(30),
  benefits: z.array(z.string().trim().min(1).max(400)).max(30),
  isActive: z.boolean(),
});

export type JobType = z.infer<typeof jobTypeSchema>;
export type PublicJobFilters = z.infer<typeof publicJobFiltersSchema>;
export type ApplicationSubmission = z.infer<typeof applicationSubmissionSchema>;
export type FacilityInquiry = z.infer<typeof facilityInquirySchema>;
export type ResumeUploadRequest = z.infer<typeof resumeUploadRequestSchema>;
export type ChatLead = z.infer<typeof chatLeadSchema>;
export type ChatRequest = z.infer<typeof chatRequestSchema>;
export type AdminJobInput = z.infer<typeof adminJobInputSchema>;
