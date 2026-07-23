import serverless from "serverless-http";
import { createApp } from "../../server/app";

// Netlify rewrites /api/* to this function while retaining the original path,
// allowing Express and tRPC to keep their existing /api/trpc route contract.
export const handler = serverless(createApp());
