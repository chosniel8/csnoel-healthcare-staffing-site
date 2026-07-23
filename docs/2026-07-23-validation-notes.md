# CSNoel Migration Validation Notes — 2026-07-23

## Administrator provisioning

The two owner-approved identities were invited through Supabase Auth and granted the `admin` role in the server-managed `public.admin_profiles` table. The verified user identifiers are recorded in the migration handoff rather than in client code. Role verification returned two records with `role = 'admin'`.

The migration file names `public.admin_profiles`; despite the table's private server-managed purpose and RLS/grant configuration, it is not located in a PostgreSQL schema named `private`. Future administrative verification queries must therefore use `public.admin_profiles` and continue to execute only through the service-role path.

## Preview magic-link validation

The isolated preview administrator route renders the Supabase email sign-in form. A live request to send an additional magic link was rejected with Supabase Auth error `over_email_send_rate_limit` / HTTP 429. Supabase Auth logs confirm that both approved invitation emails were successfully sent before the limit was encountered.

The first invitation was previously accepted, which consumed its one-time token. Do not reuse that invitation URL. The remaining full browser sign-in validation should be resumed only after the Supabase email rate-limit window permits a fresh magic-link request; do not weaken or raise the rate limit merely to complete testing.

Supabase documents that magic links are single-use and that only configured Site URL/additional redirect URLs may receive redirects. The preview URL is already configured as an allowed redirect destination.

The completed administrator-session validation used the Supabase Admin `generateLink` capability from the server-only service-role environment. It did not send another email, alter Supabase Auth rate limits, or expose an access token. The generated one-time session was accepted by the protected `admin.jobs` procedure on both the isolated preview and the final custom domain.

## Preview test records

A clearly labeled, active preview-only job was created through the server-verified administrator procedure. Its public listing is visible on the isolated Netlify preview and is intended solely to allow the candidate application workflow to be tested. It must be removed with the other labeled test records after the migration validation is complete.

The public job board and detail page both render this record correctly, including its preview-only designation, job type, location, compensation placeholder, requirements, benefits, and private-resume notice.

The public application modal opened successfully for the preview-only job. It accepted a non-personal, clearly labeled test applicant record and the matching preview-only PDF résumé, while displaying the expected private-storage statement.

The preview-only candidate application submitted successfully. The UI displayed the confirmation, “Application received,” and stated that the CSNoel team had been notified, confirming the public form, private file upload, application persistence, and owner-alert paths for the labeled test record.

## Remaining public-form validation

The isolated preview facility page renders the expected secure server-side inquiry form with required name, organization, email, coverage-details fields and an optional phone field. The public chatbot entry point is also available from the lower-right corner of the same page for a separate clearly labeled lead test.

The same public `staffing.submitFacilityInquiry` contract invoked by the facility page accepted the clearly labeled, non-personal preview-only inquiry and returned successfully. This validates the facility-lead persistence and owner-alert path without using personal contact information.

## Production domain cutover and verification

Following the owner-approved transfer, `csnoelhealthcarestaffing.com` is the primary domain on the Git-backed `csnoel-healthcare-migration-preview` Netlify project, and `www.csnoelhealthcarestaffing.com` automatically redirects to the root. HTTPS enforcement is enabled with Netlify’s Let’s Encrypt certificate for both names.

Post-cutover verification returned a Netlify `200` response and the expected CSNoel page title from the root domain, while `www` returned a Netlify `301` redirect to the root. Both responses include Strict Transport Security. The public homepage and jobs route render correctly on the live custom domain; the removed preview-only job no longer appears in public results.

The authoritative DNS remains on Squarespace. The active Google Workspace MX record (`smtp.google.com`) remains present, and no nameserver, MX, SPF, DKIM, or DMARC record was changed during the web cutover.

## Preview-record cleanup

After the preview workflows were verified, all clearly labeled validation records were removed. The cleanup deleted one preview-only job, one application, two leads, three related owner notifications, one resume-upload record, one chatbot conversation with its messages, and the associated private résumé object. The post-cleanup database verification returned zero remaining rows for every scoped record, and the private storage directory listing confirms the résumé object is absent.

## References

- Supabase, [Passwordless email logins](https://supabase.com/docs/guides/auth/auth-email-passwordless)
- Supabase, [Admin `generateLink` JavaScript reference](https://supabase.com/docs/reference/javascript/auth-admin-generatelink)
