import { z } from "zod";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, publicProcedure, router } from "./_core/trpc";
import {
  adminJobInputSchema,
  applicationSubmissionSchema,
  chatRequestSchema,
  facilityInquirySchema,
  jobIdSchema,
  publicJobFiltersSchema,
  resumeUploadRequestSchema,
} from "./csnoelModels";
import { replyToChat } from "./csnoelChatbot";
import * as csnoel from "./csnoelServices";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(() => ({ success: true }) as const),
  }),
  staffing: router({
    jobs: publicProcedure.input(publicJobFiltersSchema).query(({ input }) =>
      csnoel.listPublicJobs(input),
    ),
    job: publicProcedure.input(jobIdSchema).query(({ input }) => csnoel.getPublicJob(input)),
    createResumeUpload: publicProcedure
      .input(resumeUploadRequestSchema)
      .mutation(({ input }) => csnoel.createResumeUpload(input)),
    submitApplication: publicProcedure
      .input(applicationSubmissionSchema)
      .mutation(({ input }) => csnoel.submitApplication(input)),
    submitFacilityInquiry: publicProcedure
      .input(facilityInquirySchema)
      .mutation(({ input }) => csnoel.submitFacilityInquiry(input)),
  }),
  chat: router({
    reply: publicProcedure.input(chatRequestSchema).mutation(({ input }) =>
      replyToChat(input.conversationId, input.message),
    ),
  }),
  admin: router({
    jobs: adminProcedure.query(() => csnoel.listAdminJobs()),
    createJob: adminProcedure.input(adminJobInputSchema).mutation(({ input }) =>
      csnoel.createAdminJob(input),
    ),
    updateJob: adminProcedure
      .input(z.object({ id: jobIdSchema, job: adminJobInputSchema }))
      .mutation(({ input }) => csnoel.updateAdminJob(input.id, input.job)),
    setJobActive: adminProcedure
      .input(z.object({ id: jobIdSchema, isActive: z.boolean() }))
      .mutation(({ input }) => csnoel.setJobActiveStatus(input.id, input.isActive)),
    applications: adminProcedure.query(() => csnoel.listAdminApplications()),
    resumeDownload: adminProcedure.input(jobIdSchema).mutation(({ input }) =>
      csnoel.createAdminResumeDownload(input),
    ),
    leads: adminProcedure.query(() => csnoel.listAdminLeads()),
    chatConversations: adminProcedure.query(() => csnoel.listAdminChatConversations()),
    chatMessages: adminProcedure.input(jobIdSchema).query(({ input }) =>
      csnoel.getAdminChatMessages(input),
    ),
    notifications: adminProcedure.query(() => csnoel.listOwnerNotifications()),
    markNotificationRead: adminProcedure.input(jobIdSchema).mutation(({ input }) =>
      csnoel.markOwnerNotificationRead(input),
    ),
  }),
});

export type AppRouter = typeof appRouter;
