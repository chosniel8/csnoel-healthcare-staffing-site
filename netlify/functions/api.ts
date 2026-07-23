import { withLambda } from "@netlify/aws-lambda-compat";
import serverless from "serverless-http";
import { createApp } from "../../server/app";

// Netlify rewrites /api/* to this function while retaining the original path,
// allowing Express and tRPC to keep their existing /api/trpc route contract.
// `withLambda` keeps the shared Express adapter intact while exporting the
// modern Fetch-based Netlify Function API, which avoids Lambda compatibility
// environment-size limits.
export default withLambda(serverless(createApp()));
