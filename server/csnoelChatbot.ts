import { TRPCError } from "@trpc/server";
import { CSNOEL_CONFIG } from "./csnoelConfig";
import {
  chatLeadSchema,
  jobIdSchema,
  publicJobFiltersSchema,
} from "./csnoelModels";
import * as staffing from "./csnoelServices";

const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";
const MAX_TOOL_ROUNDS = 3;

const REDACTION_PATTERNS: Array<[RegExp, string]> = [
  [/\b[\w.%+-]+@[\w.-]+\.[A-Za-z]{2,}\b/g, "[email redacted]"],
  [/\b(?:\+?1[-.\s]?)?(?:\(?\d{3}\)?[-.\s]?)\d{3}[-.\s]?\d{4}\b/g, "[phone redacted]"],
  [/\b\d{3}[-\s]?\d{2}[-\s]?\d{4}\b/g, "[sensitive identifier redacted]"],
  [/\b(?:\d[ -]*?){13,16}\b/g, "[sensitive identifier redacted]"],
  [/(password|passcode|security answer)\s*[:=]\s*\S+/gi, "$1: [redacted]"],
];

export const CHATBOT_INSTRUCTIONS = `You are the CSNoel Healthcare Staffing Assistant. You help clinicians discover current CSNoel opportunities and help healthcare facilities begin a staffing inquiry.

Be warm, concise, and professional. Speak only about CSNoel, its current public job postings, the general application process, and facility staffing inquiries. Do not invent job availability, job requirements, salary, benefits, credentials, turnaround times, partnerships, policies, or clinical guidance. Use the available tools whenever a user asks about live roles, a particular opening, or asks to be contacted.

You are not a clinician, legal advisor, or emergency service. Do not provide medical, legal, employment-law, credentialing, or immigration advice. Do not accept patient health information, Social Security numbers, date of birth, license numbers, government identifiers, passwords, or resume content in chat. If a visitor shares such information, ask them to remove it and direct them to the appropriate secure application process or to a qualified professional.

For job searches, call search_jobs with the supplied filters and use null for any unknown filter. For a specific position, call get_job_details with its exact job identifier. If essential information is missing, ask one short follow-up question. For lead capture, call submit_lead only after the visitor has explicitly agreed that CSNoel may contact them and only when you have a name, email, and whether they are a clinician or facility representative. Set confirmed_consent to true only after that explicit agreement. Use null for an optional phone or message that was not supplied. Do not repeatedly request contact information.

After submitting a lead, confirm that CSNoel will follow up; do not promise a specific response time. Keep answers short and human. Use plain language and headings only when useful.`;

export const CHATBOT_TOOLS = [
  {
    type: "function" as const,
    name: "search_jobs",
    description: "Search current active CSNoel healthcare staffing opportunities by optional specialty, location, and job type.",
    strict: true,
    parameters: {
      type: "object",
      properties: {
        specialty: { type: ["string", "null"], description: "Healthcare specialty or discipline, if known." },
        location: { type: ["string", "null"], description: "City, state, or geographic preference, if known." },
        type: {
          type: ["string", "null"],
          enum: ["Travel", "LTC", "Rapid Response", "Per Diem", null],
          description: "Exact CSNoel job type, if known.",
        },
      },
      required: ["specialty", "location", "type"],
      additionalProperties: false,
    },
  },
  {
    type: "function" as const,
    name: "get_job_details",
    description: "Retrieve the current public details for a specific active CSNoel job opening.",
    strict: true,
    parameters: {
      type: "object",
      properties: {
        job_id: { type: "string", description: "The UUID of the CSNoel job opening." },
      },
      required: ["job_id"],
      additionalProperties: false,
    },
  },
  {
    type: "function" as const,
    name: "submit_lead",
    description: "Create a secure CSNoel follow-up lead after the visitor has explicitly consented to contact.",
    strict: true,
    parameters: {
      type: "object",
      properties: {
        name: { type: "string", description: "Visitor's full name." },
        email: { type: "string", description: "Visitor's valid email address." },
        phone: { type: ["string", "null"], description: "Optional phone number supplied by the visitor." },
        type: { type: "string", enum: ["clinician", "facility"], description: "Visitor category." },
        message: { type: ["string", "null"], description: "Optional concise summary of the visitor's request; never include sensitive personal or health data." },
        confirmed_consent: { type: "boolean", enum: [true], description: "Must be true only after the visitor explicitly agrees to CSNoel follow-up contact." },
      },
      required: ["name", "email", "phone", "type", "message", "confirmed_consent"],
      additionalProperties: false,
    },
  },
] as const;

type ResponsesFunctionCall = {
  type: "function_call";
  name: string;
  call_id: string;
  arguments: string;
};

type ResponsesMessage = {
  type: "message";
  content?: Array<{ type?: string; text?: string }>;
};

type ResponsesPayload = {
  id?: string;
  output_text?: string;
  output?: Array<ResponsesFunctionCall | ResponsesMessage | { type?: string; [key: string]: unknown }>;
  error?: { message?: string };
};

export function redactConversationContent(content: string): string {
  return REDACTION_PATTERNS.reduce(
    (redacted, [pattern, replacement]) => redacted.replace(pattern, replacement),
    content,
  );
}

function asFunctionCalls(response: ResponsesPayload): ResponsesFunctionCall[] {
  return (response.output ?? []).filter((item): item is ResponsesFunctionCall =>
    item.type === "function_call" &&
    typeof (item as ResponsesFunctionCall).name === "string" &&
    typeof (item as ResponsesFunctionCall).call_id === "string" &&
    typeof (item as ResponsesFunctionCall).arguments === "string",
  );
}

function responseText(response: ResponsesPayload): string {
  if (typeof response.output_text === "string" && response.output_text.trim()) {
    return response.output_text.trim();
  }
  const text = (response.output ?? [])
    .filter((item): item is ResponsesMessage => item.type === "message")
    .flatMap(item => item.content ?? [])
    .filter(item => item.type === "output_text" && typeof item.text === "string")
    .map(item => item.text ?? "")
    .join("\n")
    .trim();
  return text || "I’m sorry, but I’m unable to respond right now. Please try again in a moment.";
}

async function requestResponse(body: Record<string, unknown>): Promise<ResponsesPayload> {
  let response: Response;
  try {
    response = await fetch(OPENAI_RESPONSES_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${CSNOEL_CONFIG.openAiApiKey}`,
      },
      body: JSON.stringify(body),
    });
  } catch (error) {
    console.error("[CSNoel chatbot] OpenAI network request failed:", error);
    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "The assistant is temporarily unavailable." });
  }

  const payload = (await response.json().catch(() => ({}))) as ResponsesPayload;
  if (!response.ok) {
    console.error("[CSNoel chatbot] OpenAI Responses API error:", response.status, payload.error?.message);
    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "The assistant is temporarily unavailable." });
  }
  return payload;
}

function parseArguments(argumentsText: string): unknown {
  try {
    return JSON.parse(argumentsText);
  } catch {
    return undefined;
  }
}

export async function executeChatTool(name: string, argumentsText: string) {
  const args = parseArguments(argumentsText);

  try {
    if (name === "search_jobs") {
      const candidate = args && typeof args === "object" ? args as Record<string, unknown> : {};
      const parsed = publicJobFiltersSchema.safeParse({
        specialty: candidate.specialty ?? undefined,
        location: candidate.location ?? undefined,
        type: candidate.type ?? undefined,
      });
      if (!parsed.success) return { ok: false, error: "Invalid job-search filters." };
      const jobs = await staffing.listPublicJobs(parsed.data);
      return {
        ok: true,
        jobs: jobs.slice(0, 8).map(job => ({
          id: job.id,
          title: job.title,
          specialty: job.specialty,
          location: job.location,
          type: job.type,
          salary_range: job.salary_range,
        })),
      };
    }

    if (name === "get_job_details") {
      const parsed = jobIdSchema.safeParse(
        args && typeof args === "object" && "job_id" in args ? (args as { job_id?: unknown }).job_id : undefined,
      );
      if (!parsed.success) return { ok: false, error: "A valid job identifier is required." };
      const job = await staffing.getPublicJob(parsed.data);
      return { ok: true, job };
    }

    if (name === "submit_lead") {
      const candidate = args && typeof args === "object" ? args as Record<string, unknown> : {};
      if (candidate.confirmed_consent !== true) {
        return { ok: false, error: "Explicit visitor consent is required before capturing a lead." };
      }
      const parsed = chatLeadSchema.safeParse({
        name: candidate.name,
        email: candidate.email,
        phone: candidate.phone ?? undefined,
        type: candidate.type,
        message: candidate.message ?? undefined,
      });
      if (!parsed.success) return { ok: false, error: "A valid name, email, and visitor type are required." };
      const lead = await staffing.createLead({ ...parsed.data, source: "chatbot" });
      return { ok: true, lead_id: lead.leadId };
    }

    return { ok: false, error: "This tool is not available." };
  } catch (error) {
    console.error(`[CSNoel chatbot] Tool ${name} failed:`, error);
    return { ok: false, error: "The requested information could not be retrieved right now." };
  }
}

export async function replyToChat(conversationId: string | undefined, message: string) {
  const conversation = await staffing.ensureChatConversation(conversationId);
  const history = await staffing.getChatHistory(conversation.id, 11);
  await staffing.appendChatMessage(conversation.id, "user", redactConversationContent(message));
  const responseInput: Array<Record<string, unknown>> = [
    ...history.map(entry => ({ role: entry.role, content: entry.content })),
    { role: "user", content: message },
  ];

  let response = await requestResponse({
    model: CSNOEL_CONFIG.openAiModel,
    instructions: CHATBOT_INSTRUCTIONS,
    input: responseInput,
    tools: CHATBOT_TOOLS,
    tool_choice: "auto",
    parallel_tool_calls: false,
    store: false,
    max_output_tokens: 700,
  });

  for (let round = 0; round < MAX_TOOL_ROUNDS; round += 1) {
    const toolCalls = asFunctionCalls(response);
    if (toolCalls.length === 0) break;

    const outputs = await Promise.all(
      toolCalls.map(async toolCall => ({
        type: "function_call_output",
        call_id: toolCall.call_id,
        output: JSON.stringify(await executeChatTool(toolCall.name, toolCall.arguments)),
      })),
    );

    // With store: false, OpenAI does not retain response IDs. The manual state
    // handoff includes every model output item (including reasoning/function-call
    // items) plus the corresponding local tool results, as required by Responses.
    responseInput.push(...(response.output ?? []) as Array<Record<string, unknown>>);
    responseInput.push(...outputs);
    response = await requestResponse({
      model: CSNOEL_CONFIG.openAiModel,
      instructions: CHATBOT_INSTRUCTIONS,
      input: responseInput,
      tools: CHATBOT_TOOLS,
      tool_choice: "auto",
      parallel_tool_calls: false,
      store: false,
      max_output_tokens: 700,
    });
  }

  const reply = responseText(response);
  await staffing.appendChatMessage(conversation.id, "assistant", redactConversationContent(reply));

  return { conversationId: conversation.id, reply };
}
