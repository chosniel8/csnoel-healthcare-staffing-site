# CSNoel Healthcare Staffing Platform

CSNoel is a full-stack healthcare staffing platform for clinicians and facilities. The application provides a photo-led public marketing experience, secure job discovery and application flows, a facility staffing-intake workflow, a role-gated administration workspace, and an AI assistant powered by the OpenAI Responses API.

## What is included

The public experience includes a responsive homepage, job board, job-detail pages, candidate applications, facilities intake, About page, and a corner-pinned staffing assistant. The administration workspace lets authorized CSNoel administrators manage job postings and review candidate applications, facility/chatbot leads, redacted chat records, and owner alerts.

The staffing backend uses Supabase for jobs, applications, leads, conversations, alerts, and private resume storage. Resume uploads are sent to a private storage bucket through a server-mediated, signed-upload workflow. Application and lead events create owner-facing alerts. The AI assistant uses the OpenAI Responses API and constrained tool calls named `search_jobs`, `get_job_details`, and `submit_lead`.

## Technology

| Layer | Implementation |
| --- | --- |
| Client | React 19, TypeScript, Vite, Tailwind CSS, shadcn/ui, tRPC client |
| Server | Node.js, Express, tRPC |
| Data | Supabase PostgreSQL and private Supabase Storage |
| Authentication | Manus OAuth with administrator role gating |
| AI | OpenAI Responses API with strict function calling |
| Validation | Zod, Vitest, TypeScript |

## Local development

Install dependencies and start the development server:

```bash
pnpm install
pnpm dev
```

Run validation before deployment:

```bash
pnpm check
pnpm test
pnpm build
```

## Required server configuration

Never commit real credentials. Configure server-side environment values through the project’s secure Secrets configuration:

```text
CSNOEL_SUPABASE_URL
CSNOEL_SUPABASE_SERVICE_ROLE_KEY
OPENAI_API_KEY
```

The required Supabase schema and security migrations are retained in `supabase/migrations/`. The service-role key is server-only; it must never be exposed to the browser.

## Operational notes

No fictional job listings, reviews, or testimonials are seeded. Add verified CSNoel opportunities through the protected **Admin → Jobs** workflow. Only active jobs appear on the public board and are eligible for AI assistant search results.

The public site has been visually verified at desktop and mobile breakpoints. The backend has TypeScript validation and a Vitest suite covering validation, role gates, alerts, credential access, and chatbot function dispatch.

## Project structure

```text
client/       React application, public pages, admin workspace, UI components
server/       tRPC routes, Supabase services, OpenAI chatbot orchestration
supabase/     audited database migrations and RLS policy definitions
docs/         architecture, integration, visual-direction, and QA notes
```

## Deployment

Create a validated project checkpoint, then use the hosting platform’s **Publish** control to deploy. Confirm that the server-only secrets are configured in the deployment environment before publishing.
