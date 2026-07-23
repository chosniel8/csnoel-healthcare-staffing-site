-- CSNoel platform backend: secure resume handoff, chatbot history, and owner alerts.

ALTER TABLE public.jobs
  DROP CONSTRAINT IF EXISTS jobs_type_check;

ALTER TABLE public.jobs
  ADD CONSTRAINT jobs_type_check
  CHECK (type IN ('Travel', 'LTC', 'Rapid Response', 'Per Diem'));

ALTER TABLE public.applications
  RENAME COLUMN resume_url TO resume_path;

CREATE TABLE public.resume_uploads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  object_path TEXT NOT NULL UNIQUE,
  original_filename TEXT NOT NULL,
  content_type TEXT NOT NULL CHECK (
    content_type IN (
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    )
  ),
  size_bytes INTEGER NOT NULL CHECK (size_bytes > 0 AND size_bytes <= 10485760),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  consumed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE public.chat_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  openai_response_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE public.chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES public.chat_conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL CHECK (char_length(content) BETWEEN 1 AND 8000),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE public.owner_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  kind TEXT NOT NULL CHECK (kind IN ('application', 'lead')),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  related_entity_id UUID NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION public.csnoel_set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS jobs_set_updated_at ON public.jobs;
CREATE TRIGGER jobs_set_updated_at
BEFORE UPDATE ON public.jobs
FOR EACH ROW
EXECUTE FUNCTION public.csnoel_set_updated_at();

DROP TRIGGER IF EXISTS chat_conversations_set_updated_at ON public.chat_conversations;
CREATE TRIGGER chat_conversations_set_updated_at
BEFORE UPDATE ON public.chat_conversations
FOR EACH ROW
EXECUTE FUNCTION public.csnoel_set_updated_at();

CREATE INDEX resume_uploads_expires_at_idx ON public.resume_uploads (expires_at);
CREATE INDEX chat_messages_conversation_created_at_idx ON public.chat_messages (conversation_id, created_at);
CREATE INDEX owner_notifications_unread_created_at_idx ON public.owner_notifications (is_read, created_at DESC);

ALTER TABLE public.resume_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.owner_notifications ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.resume_uploads FROM anon, authenticated;
REVOKE ALL ON TABLE public.chat_conversations FROM anon, authenticated;
REVOKE ALL ON TABLE public.chat_messages FROM anon, authenticated;
REVOKE ALL ON TABLE public.owner_notifications FROM anon, authenticated;

GRANT ALL ON TABLE public.resume_uploads TO service_role;
GRANT ALL ON TABLE public.chat_conversations TO service_role;
GRANT ALL ON TABLE public.chat_messages TO service_role;
GRANT ALL ON TABLE public.owner_notifications TO service_role;

COMMENT ON TABLE public.resume_uploads IS
  'Server-created, single-use records that authorize short-lived private resume uploads.';
COMMENT ON TABLE public.chat_conversations IS
  'Server-side chat conversation metadata without visitor identity fields.';
COMMENT ON TABLE public.chat_messages IS
  'Server-side chat transcripts for authorized CSNoel administrative review.';
COMMENT ON TABLE public.owner_notifications IS
  'In-app owner alerts generated for new candidate applications and captured leads.';
