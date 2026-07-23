# CSNoel Healthcare Staffing Production Handoff

**Status:** The Git-backed CSNoel healthcare platform is live at [csnoelhealthcarestaffing.com](https://csnoelhealthcarestaffing.com). The Netlify project is configured with the root domain as primary, `www` as an automatic redirect, and HTTPS enforcement enabled.

## Production access

The protected administrator entry point is [https://csnoelhealthcarestaffing.com/admin](https://csnoelhealthcarestaffing.com/admin). The approved administrator identities are `chosniel8@gmail.com` and `info@csnoelhealthcarestaffing.com`. Both have an `admin` role in the server-managed Supabase authorization table. They should authenticate through the standard Supabase email sign-in screen; no client-side role override exists.

| Area | Operational state |
|---|---|
| Public site | Live at the custom root domain and served through Netlify. |
| `www` hostname | Redirects to the secure root domain. |
| Administrator gate | Supabase Bearer-token validation plus server-side role lookup on every protected request. |
| Resume files | Stored in the private `resumes` bucket and available only through short-lived server-generated URLs. |
| Continuous deployment | The Git-backed Netlify project deploys the configured repository changes. |

## Domain and email DNS

The cutover reassigned the domain **inside Netlify only**. The external DNS provider remains Squarespace. Existing Google Workspace mail records, including the active MX route, were not changed. This distinction is important: future website routing changes should continue to avoid changing MX, SPF, DKIM, DMARC, or nameserver records unless email administration is intentionally in scope.

## Validation record

The isolated Netlify preview validated a candidate application with private résumé upload, a facility inquiry, a chatbot lead, owner-alert persistence, protected administrator access, and public job delivery. The labeled test job, application, leads, chat history, notifications, upload record, and private résumé object were then removed. The live domain was validated for HTTPS, root and `www` routing, public homepage and job route rendering, and a fresh one-time Supabase administrator session accepted by the protected API.

> The Supabase email-send rate limit was not relaxed to facilitate testing. If an administrator needs a new email link, use the standard `/admin` sign-in screen after the provider’s normal rate-limit window, rather than weakening the authentication configuration.

## Routine administration

Administrators can create, update, or deactivate jobs and review applications, leads, alerts, and chat history from the protected dashboard. The live jobs board intentionally shows no openings until an administrator creates an active job; no synthetic job records are retained from validation.

## References

[1] [Supabase Auth: Passwordless email logins](https://supabase.com/docs/guides/auth/auth-email-passwordless)

[2] [Supabase Auth: Admin `generateLink`](https://supabase.com/docs/reference/javascript/auth-admin-generatelink)

[3] [Netlify: HTTPS and TLS certificates](https://docs.netlify.com/manage/domains/secure-domains-with-https/)

