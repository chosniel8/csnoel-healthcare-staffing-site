# CSNoel Runtime Migration Notes

## Applied Supabase Auth configuration

On 2026-07-23, the Supabase Auth **Site URL** was saved as `https://csnoelhealthcarestaffing.com`. The redirect allow-list was saved with the four exact `/admin` URLs listed below. This supports the application's deliberate `window.location.origin + "/admin"` magic-link callback and does not authorize arbitrary redirect paths.

## Verified domains

The connected Netlify project uses `csnoelhealthcarestaffing.com` as its primary production domain, with `www.csnoelhealthcarestaffing.com` redirecting to that primary domain and `admirable-haupia-a7193b.netlify.app` available as the Netlify project subdomain. The Supabase Auth Site URL field was prepared with `https://csnoelhealthcarestaffing.com`.

## Supabase Auth redirects

The Supabase URL Configuration page initially contained no redirect URLs. The magic-link client sends users to `/admin`, so the required allow-list entries are `https://csnoelhealthcarestaffing.com/admin`, `https://www.csnoelhealthcarestaffing.com/admin`, `https://admirable-haupia-a7193b.netlify.app/admin`, and the local-development value `http://localhost:3000/admin`.

## Netlify routing model

The implementation follows Netlify's Express deployment model: a Netlify Function exports a `serverless-http` wrapper around the shared Express application, a rewrite maps `/api/*` to that function, and the SPA fallback is evaluated afterward. See the official references below.

## Required Netlify environment variables

The following values were saved in **Project configuration → Environment variables** on 2026-07-23. They are marked as secrets, apply to the project’s build, Functions, and runtime scopes, and are available in all deploy contexts. Do not place any of these values in source control or client-side code.

| Variable | Netlify scope | Purpose |
| --- | --- | --- |
| `VITE_CSNOEL_SUPABASE_URL` | Build; all deploy contexts | Browser-safe Supabase project URL compiled into the Vite client. |
| `VITE_CSNOEL_SUPABASE_ANON_KEY` | Build; all deploy contexts | Browser-safe Supabase publishable key compiled into the Vite client. |
| `CSNOEL_SUPABASE_URL` | Functions; all deploy contexts | Server-side Supabase project URL used by tRPC, storage, and role checks. |
| `CSNOEL_SUPABASE_SERVICE_ROLE_KEY` | Functions; all deploy contexts | Secret server-only key for private resumes and `admin_profiles`; never expose it in a `VITE_` variable. |
| `OPENAI_API_KEY` | Functions; all deploy contexts | Secret server-only key used by the staffing chatbot. |
| `CSNOEL_OPENAI_MODEL` | Functions; all deploy contexts; optional | Optional model override. The application defaults to `gpt-5.4-mini`. |

The legacy `DATABASE_URL`, Manus OAuth, Forge, and cookie-secret variables are not needed by the Netlify function path. The browser client calls `/api/trpc` only after the access-token header is attached; the function verifies that token against Supabase before performing a role-gated request.

## Preview-deploy prerequisite

The connected Netlify project currently uses **Netlify Drop** rather than continuous deployment. A full-stack serverless preview should be deployed through a repository-backed build or an authenticated Netlify CLI deploy. A static folder upload alone does not run the configured Netlify Function build.

## References

1. [Netlify: Express on Netlify](https://docs.netlify.com/build/frameworks/framework-setup-guides/express/)
2. [Netlify: Redirects and rewrites](https://docs.netlify.com/manage/routing/redirects/overview/)
