# Netlify Preview Environment Repair

The isolated `csnoel-healthcare-migration-preview` Netlify project deploys the `netlify-preview-migration` branch. Its first build completed, but the browser bundle lacked Supabase settings because its Production-context values were empty. The two Vite variables—`VITE_CSNOEL_SUPABASE_ANON_KEY` and `VITE_CSNOEL_SUPABASE_URL`—and the three server-side values—`CSNOEL_SUPABASE_URL`, `CSNOEL_SUPABASE_SERVICE_ROLE_KEY`, and `OPENAI_API_KEY`—now have saved Production-context values. The browser-safe endpoint is configured in Netlify rather than repeated in repository documentation.

## 2026-07-23 — Lambda compatibility environment-size failure

The rebuilt isolated preview successfully completed the Vite build but failed while Netlify created the `api` Function. The deployment log reported: **“Your environment variables exceed the 4KB limit imposed by AWS Lambda.”**

A local, non-disclosing length check totals **509 characters** for the five visible application values, indicating that the Lambda compatibility mode’s effective environment exceeds the size budget after platform/runtime variables are included rather than because the visible application secrets are unusually long.

Official Netlify guidance confirms both relevant remedies: restrict variables to only the scopes that need them, or migrate to the modern Functions runtime, which removes the Lambda compatibility limit. The modern runtime migration was committed, published, and rebuilt successfully. Sources: [Netlify Functions environment variables](https://docs.netlify.com/build/functions/environment-variables/) and [Lambda compatibility for Functions](https://docs.netlify.com/build/functions/lambda-compatibility/).

## 2026-07-23 — Published preview and smoke tests

The published isolated preview is available at `https://csnoel-healthcare-migration-preview.netlify.app`. The landing page and `/admin` route render. The anonymous `auth.me` endpoint returns successfully, and an unauthenticated request to the protected `admin.jobs` procedure is rejected without exposing an internal stack trace. The modern Function and browser bundle therefore load as expected without changing the live custom-domain deployment.

The Supabase redirect allow-list now includes `https://csnoel-healthcare-migration-preview.netlify.app/admin`, so the isolated preview is authorized for the application's `/admin` magic-link callback. Application, facility/chatbot lead, and authenticated administrator workflows are intentionally pending because exercising them would create live records and alerts without an approved test identity or test-data policy.

## 2026-07-23 — Public jobs API diagnostic

The published `/jobs` screen remained in its loading state because the `staffing.jobs` tRPC procedure returned HTTP 500. Netlify Function logs identify the failure as `TypeError: Cannot convert argument to a ByteString`, emitted while listing public jobs through the server-side Supabase client. This indicates that the preview’s saved `CSNOEL_SUPABASE_SERVICE_ROLE_KEY` is malformed for an HTTP authorization header; it must be replaced from the canonical server-only secret before the public data path can be treated as validated. No stack trace is returned to the browser.

The canonical service-role key was copied directly from Supabase into the Netlify **Production** editor through the browser and saved. The credential was not written to the repository or disclosed in this handoff note. The resulting redeploy completed successfully at 01:35 CDT, with two rewrite rules and one Function published. A fresh anonymous `staffing.jobs` request now returns a successful empty result, and the `/jobs` page renders the expected **0 openings found** state rather than remaining in a loading state.
