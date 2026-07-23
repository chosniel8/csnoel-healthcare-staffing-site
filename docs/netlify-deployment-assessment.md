# Netlify Deployment Assessment

## Findings

The current CSNoel application combines a Vite/React client with an Express-style Node server that exposes tRPC endpoints. Netlify can support this architecture only by deploying the server portion as a **Netlify Function** rather than as the project’s persistent Express listener. Netlify’s Express guidance explicitly describes wrapping Express with a serverless adapter, configuring a function entry point, and rewriting API routes to the resulting function endpoint.[1]

The Vite client can be deployed through Netlify’s standard Vite build flow, but the client-side router also needs an SPA fallback so routes such as `/jobs`, `/about`, and `/admin` resolve to the Vite entry document instead of returning a CDN 404.[2]

The OpenAI API key and Supabase service-role key must be entered in Netlify’s secure environment-variable interface. They must be scoped to Functions at runtime, and changes require a new deploy because function values are applied at deployment time.[3]

## Consequence for CSNoel

The current production build command creates a long-running Node server (`dist/index.js`), which is compatible with the project’s managed hosting but **is not directly deployable as-is to Netlify**. Before cutover, the repository must receive a Netlify adapter and configuration that preserve the existing `/api/trpc/*` contract within a serverless function. The public client may then continue to call the same API paths.

## Safety boundary

No live Netlify site assignment, custom-domain reassignment, or DNS record should be changed until a serverless preview has passed: public-page rendering, active-job retrieval, secure application handoff, facilities intake, live chatbot response, role-gated admin access, and owner alert creation.

## Existing Netlify project state

The current production target is Netlify project `admirable-haupia-a7193b` (project ID `47b3a448-5deb-46fc-addc-3c1f246173f9`) and currently serves `csnoelhealthcarestaffing.com`. It was last deployed using **Netlify Drop** and has no Git repository linked for continuous deployment. Its Functions region is CMH (Ohio, US East). The full-stack deployment should therefore be linked to the requested GitHub repository only after the required serverless-function adapter and a successful preview deploy are in place.

## Supabase Auth migration requirements

Supabase requires the configured Site URL and every `redirectTo` destination to match an allowed redirect URL. The Netlify preview hostname and both production variants (`https://csnoelhealthcarestaffing.com` and `https://www.csnoelhealthcarestaffing.com`) must be configured before a magic-link or password-reset flow is tested. The server must verify a presented access token with `auth.getUser()` rather than trusting client session state. Administrator authorization will be evaluated by a private, server-managed role table rather than by a browser-supplied flag.

References: [Supabase Redirect URLs](https://supabase.com/docs/guides/auth/redirect-urls); [Supabase auth.getUser](https://supabase.com/docs/reference/javascript/auth-getuser); [Supabase RBAC guidance](https://supabase.com/docs/guides/api/custom-claims-and-role-based-access-control-rbac).

## References

[1] [Netlify, “Express on Netlify”](https://docs.netlify.com/build/frameworks/framework-setup-guides/express/)

[2] [Netlify, “Vite on Netlify”](https://docs.netlify.com/build/frameworks/framework-setup-guides/vite/)

[3] [Netlify, “Environment variables and serverless functions”](https://docs.netlify.com/build/functions/environment-variables/)
