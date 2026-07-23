-- Explicitly document the server-only access model for protected CSNoel data.
-- Browser-facing roles remain denied; server operations use the Supabase service role.

DROP POLICY IF EXISTS "csnoel_service_role_only" ON public.applications;
CREATE POLICY "csnoel_service_role_only"
ON public.applications FOR ALL TO service_role
USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "csnoel_service_role_only" ON public.leads;
CREATE POLICY "csnoel_service_role_only"
ON public.leads FOR ALL TO service_role
USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "csnoel_service_role_only" ON public.resume_uploads;
CREATE POLICY "csnoel_service_role_only"
ON public.resume_uploads FOR ALL TO service_role
USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "csnoel_service_role_only" ON public.chat_conversations;
CREATE POLICY "csnoel_service_role_only"
ON public.chat_conversations FOR ALL TO service_role
USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "csnoel_service_role_only" ON public.chat_messages;
CREATE POLICY "csnoel_service_role_only"
ON public.chat_messages FOR ALL TO service_role
USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "csnoel_service_role_only" ON public.owner_notifications;
CREATE POLICY "csnoel_service_role_only"
ON public.owner_notifications FOR ALL TO service_role
USING (true) WITH CHECK (true);
