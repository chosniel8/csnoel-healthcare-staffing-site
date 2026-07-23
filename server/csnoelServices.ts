import { TRPCError } from "@trpc/server";
import { randomUUID } from "node:crypto";
import { notifyOwner } from "./_core/notification";
import { CSNOEL_CONFIG } from "./csnoelConfig";
import type {
  AdminJobInput,
  ApplicationSubmission,
  ChatLead,
  FacilityInquiry,
  PublicJobFilters,
  ResumeUploadRequest,
} from "./csnoelModels";
import { supabase } from "./supabase";

const JOB_SELECT_FIELDS =
  "id,title,location,type,specialty,description,salary_range,requirements,benefits,is_active,created_at,updated_at";

function dbFailure(action: string, detail?: string): never {
  console.error(`[CSNoel] ${action} failed${detail ? `: ${detail}` : ""}`);
  throw new TRPCError({
    code: "INTERNAL_SERVER_ERROR",
    message: "We could not complete that request. Please try again shortly.",
  });
}

function normalizeOptional(value: string | undefined): string | null {
  const normalized = value?.trim();
  return normalized ? normalized : null;
}

function filenameExtension(mimeType: ResumeUploadRequest["mimeType"]): string {
  switch (mimeType) {
    case "application/pdf":
      return "pdf";
    case "application/msword":
      return "doc";
    default:
      return "docx";
  }
}

export async function listPublicJobs(filters: PublicJobFilters) {
  let query = supabase
    .from("jobs")
    .select(JOB_SELECT_FIELDS)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (filters.specialty) query = query.ilike("specialty", `%${filters.specialty}%`);
  if (filters.location) query = query.ilike("location", `%${filters.location}%`);
  if (filters.type) query = query.eq("type", filters.type);

  const { data, error } = await query;
  if (error) dbFailure("Listing public jobs", error.message);
  return data ?? [];
}

export async function getPublicJob(jobId: string) {
  const { data, error } = await supabase
    .from("jobs")
    .select(JOB_SELECT_FIELDS)
    .eq("id", jobId)
    .eq("is_active", true)
    .maybeSingle();

  if (error) dbFailure("Loading public job", error.message);
  if (!data) {
    throw new TRPCError({ code: "NOT_FOUND", message: "This position is no longer available." });
  }
  return data;
}

export async function createResumeUpload(request: ResumeUploadRequest) {
  await ensureActiveJob(request.jobId);
  const uploadId = randomUUID();
  const extension = filenameExtension(request.mimeType);
  const objectPath = `applications/${new Date().toISOString().slice(0, 10)}/${uploadId}.${extension}`;
  const expiresAt = new Date(Date.now() + CSNOEL_CONFIG.uploadExpirySeconds * 1000).toISOString();

  const { error: recordError } = await supabase.from("resume_uploads").insert({
    id: uploadId,
    object_path: objectPath,
    original_filename: request.fileName,
    content_type: request.mimeType,
    size_bytes: request.sizeBytes,
    expires_at: expiresAt,
  });
  if (recordError) dbFailure("Creating resume upload authorization", recordError.message);

  const { data, error } = await supabase.storage
    .from(CSNOEL_CONFIG.resumeBucket)
    .createSignedUploadUrl(objectPath);
  if (error || !data) dbFailure("Creating private resume upload URL", error?.message);

  const signedUrl = data.signedUrl.startsWith("http")
    ? data.signedUrl
    : new URL(data.signedUrl, CSNOEL_CONFIG.supabaseUrl).toString();

  return {
    uploadToken: uploadId,
    objectPath,
    signedUrl,
    token: data.token,
    expiresAt,
  };
}

async function consumeResumeUpload(uploadToken: string) {
  const now = new Date().toISOString();
  const { data: pendingUpload, error: pendingUploadError } = await supabase
    .from("resume_uploads")
    .select("object_path")
    .eq("id", uploadToken)
    .is("consumed_at", null)
    .gt("expires_at", now)
    .maybeSingle();

  if (pendingUploadError) dbFailure("Checking resume upload", pendingUploadError.message);
  if (!pendingUpload) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Your resume upload link has expired. Please upload the file again.",
    });
  }

  const separatorIndex = pendingUpload.object_path.lastIndexOf("/");
  const directory = pendingUpload.object_path.slice(0, separatorIndex);
  const fileName = pendingUpload.object_path.slice(separatorIndex + 1);
  const { data: storageObjects, error: storageError } = await supabase.storage
    .from(CSNOEL_CONFIG.resumeBucket)
    .list(directory, { limit: 10, search: fileName });

  if (storageError) dbFailure("Checking private resume file", storageError.message);
  if (!storageObjects?.some(object => object.name === fileName)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Please finish uploading your resume before submitting the application.",
    });
  }

  const { data, error } = await supabase
    .from("resume_uploads")
    .update({ consumed_at: now })
    .eq("id", uploadToken)
    .is("consumed_at", null)
    .gt("expires_at", now)
    .select("object_path")
    .maybeSingle();

  if (error) dbFailure("Validating resume upload", error.message);
  if (!data) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Your resume upload link has expired. Please upload the file again.",
    });
  }
  return data.object_path;
}

async function ensureActiveJob(jobId: string) {
  const { data, error } = await supabase
    .from("jobs")
    .select("id,title")
    .eq("id", jobId)
    .eq("is_active", true)
    .maybeSingle();
  if (error) dbFailure("Checking job availability", error.message);
  if (!data) {
    throw new TRPCError({ code: "NOT_FOUND", message: "This position is no longer accepting applications." });
  }
  return data;
}

export async function dispatchOwnerAlert(
  kind: "application" | "lead",
  relatedEntityId: string,
  title: string,
  body: string,
) {
  const { error } = await supabase.from("owner_notifications").insert({
    kind,
    related_entity_id: relatedEntityId,
    title,
    body,
  });
  if (error) console.error("[CSNoel] Failed to record in-app owner alert:", error.message);

  try {
    const dispatched = await notifyOwner({ title, content: body });
    if (!dispatched) console.warn("[CSNoel] Owner push alert was not accepted by the notification service.");
  } catch (notificationError) {
    console.error("[CSNoel] Owner push alert threw an error:", notificationError);
  }
}

export async function submitApplication(input: ApplicationSubmission) {
  const job = await ensureActiveJob(input.jobId);
  const resumePath = await consumeResumeUpload(input.uploadToken);

  const { data, error } = await supabase
    .from("applications")
    .insert({
      job_id: input.jobId,
      applicant_name: input.applicantName,
      applicant_email: input.applicantEmail,
      applicant_phone: normalizeOptional(input.applicantPhone),
      resume_path: resumePath,
      status: "pending",
    })
    .select("id")
    .single();
  if (error) dbFailure("Saving candidate application", error.message);

  await dispatchOwnerAlert(
    "application",
    data.id,
    "New CSNoel candidate application",
    `A candidate submitted an application for ${job.title}. Review it in the CSNoel admin dashboard.`,
  );

  return { success: true, applicationId: data.id };
}

export async function submitFacilityInquiry(input: FacilityInquiry) {
  return createLead({
    name: input.contactName,
    email: input.email,
    phone: input.phone,
    type: "facility",
    message: `${input.organization}: ${input.message}`,
    source: "facilities_form",
  });
}

export async function createLead(
  input: ChatLead & { source?: "chatbot" | "facilities_form" },
) {
  const { data, error } = await supabase
    .from("leads")
    .insert({
      name: input.name,
      email: input.email,
      phone: normalizeOptional(input.phone),
      type: input.type,
      message: normalizeOptional(input.message),
      source: input.source ?? "chatbot",
      status: "new",
    })
    .select("id")
    .single();
  if (error) dbFailure("Saving staffing lead", error.message);

  await dispatchOwnerAlert(
    "lead",
    data.id,
    "New CSNoel staffing lead",
    `A ${input.type} lead was captured. Review the lead in the CSNoel admin dashboard.`,
  );

  return { success: true, leadId: data.id };
}

export async function listAdminJobs() {
  const { data, error } = await supabase
    .from("jobs")
    .select(JOB_SELECT_FIELDS)
    .order("updated_at", { ascending: false });
  if (error) dbFailure("Listing admin jobs", error.message);
  return data ?? [];
}

export async function createAdminJob(input: AdminJobInput) {
  const { data, error } = await supabase
    .from("jobs")
    .insert({
      title: input.title,
      location: input.location,
      type: input.type,
      specialty: input.specialty,
      description: input.description,
      salary_range: normalizeOptional(input.salaryRange),
      requirements: input.requirements,
      benefits: input.benefits,
      is_active: input.isActive,
    })
    .select(JOB_SELECT_FIELDS)
    .single();
  if (error) dbFailure("Creating job posting", error.message);
  return data;
}

export async function updateAdminJob(jobId: string, input: AdminJobInput) {
  const { data, error } = await supabase
    .from("jobs")
    .update({
      title: input.title,
      location: input.location,
      type: input.type,
      specialty: input.specialty,
      description: input.description,
      salary_range: normalizeOptional(input.salaryRange),
      requirements: input.requirements,
      benefits: input.benefits,
      is_active: input.isActive,
    })
    .eq("id", jobId)
    .select(JOB_SELECT_FIELDS)
    .maybeSingle();
  if (error) dbFailure("Updating job posting", error.message);
  if (!data) throw new TRPCError({ code: "NOT_FOUND", message: "Job posting not found." });
  return data;
}

export async function setJobActiveStatus(jobId: string, isActive: boolean) {
  const { data, error } = await supabase
    .from("jobs")
    .update({ is_active: isActive })
    .eq("id", jobId)
    .select("id,is_active")
    .maybeSingle();
  if (error) dbFailure("Updating job status", error.message);
  if (!data) throw new TRPCError({ code: "NOT_FOUND", message: "Job posting not found." });
  return data;
}

export async function listAdminApplications() {
  const { data, error } = await supabase
    .from("applications")
    .select("id,job_id,applicant_name,applicant_email,applicant_phone,status,created_at,resume_path")
    .order("created_at", { ascending: false });
  if (error) dbFailure("Listing candidate applications", error.message);
  return data ?? [];
}

export async function createAdminResumeDownload(applicationId: string) {
  const { data: application, error: applicationError } = await supabase
    .from("applications")
    .select("resume_path")
    .eq("id", applicationId)
    .maybeSingle();
  if (applicationError) dbFailure("Loading application resume", applicationError.message);
  if (!application?.resume_path) {
    throw new TRPCError({ code: "NOT_FOUND", message: "No resume file is available for this application." });
  }

  const { data, error } = await supabase.storage
    .from(CSNOEL_CONFIG.resumeBucket)
    .createSignedUrl(application.resume_path, CSNOEL_CONFIG.signedDownloadExpirySeconds);
  if (error || !data) dbFailure("Creating private resume download URL", error?.message);
  return { signedUrl: data.signedUrl };
}

export async function listAdminLeads() {
  const { data, error } = await supabase
    .from("leads")
    .select("id,name,email,phone,type,message,source,status,created_at")
    .order("created_at", { ascending: false });
  if (error) dbFailure("Listing staffing leads", error.message);
  return data ?? [];
}

export async function listOwnerNotifications() {
  const { data, error } = await supabase
    .from("owner_notifications")
    .select("id,kind,title,body,related_entity_id,is_read,created_at")
    .order("created_at", { ascending: false })
    .limit(50);
  if (error) dbFailure("Listing owner notifications", error.message);
  return data ?? [];
}

export async function markOwnerNotificationRead(notificationId: string) {
  const { data, error } = await supabase
    .from("owner_notifications")
    .update({ is_read: true })
    .eq("id", notificationId)
    .select("id,is_read")
    .maybeSingle();
  if (error) dbFailure("Marking owner notification read", error.message);
  if (!data) throw new TRPCError({ code: "NOT_FOUND", message: "Notification not found." });
  return data;
}

export async function ensureChatConversation(conversationId?: string) {
  if (conversationId) {
    const { data, error } = await supabase
      .from("chat_conversations")
      .select("id")
      .eq("id", conversationId)
      .maybeSingle();
    if (error) dbFailure("Loading chat conversation", error.message);
    if (!data) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Chat conversation not found." });
    }
    return data;
  }

  const { data, error } = await supabase
    .from("chat_conversations")
    .insert({})
    .select("id")
    .single();
  if (error) dbFailure("Creating chat conversation", error.message);
  return data;
}

export async function appendChatMessage(
  conversationId: string,
  role: "user" | "assistant",
  content: string,
) {
  const { error } = await supabase.from("chat_messages").insert({
    conversation_id: conversationId,
    role,
    content,
  });
  if (error) dbFailure("Saving chat message", error.message);
}

export async function getChatHistory(conversationId: string, limit: number) {
  const { data, error } = await supabase
    .from("chat_messages")
    .select("role,content,created_at")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) dbFailure("Loading chat history", error.message);
  return (data ?? []).reverse();
}

export async function setChatOpenAiResponseId(conversationId: string, responseId: string) {
  const { error } = await supabase
    .from("chat_conversations")
    .update({ openai_response_id: responseId })
    .eq("id", conversationId);
  if (error) dbFailure("Updating chat response metadata", error.message);
}

export async function listAdminChatConversations() {
  const { data, error } = await supabase
    .from("chat_conversations")
    .select("id,created_at,updated_at")
    .order("updated_at", { ascending: false })
    .limit(100);
  if (error) dbFailure("Listing chat conversations", error.message);
  return data ?? [];
}

export async function getAdminChatMessages(conversationId: string) {
  const { data, error } = await supabase
    .from("chat_messages")
    .select("id,role,content,created_at")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });
  if (error) dbFailure("Loading chat conversation", error.message);
  return data ?? [];
}
