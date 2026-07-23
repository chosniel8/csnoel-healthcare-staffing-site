-- CSNoel administrator roles are intentionally separate from browser-controlled
-- user metadata. The application resolves this role only with its server key.
CREATE TABLE IF NOT EXISTS public.admin_profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS admin_profiles_set_updated_at ON public.admin_profiles;
CREATE TRIGGER admin_profiles_set_updated_at
BEFORE UPDATE ON public.admin_profiles
FOR EACH ROW
EXECUTE FUNCTION public.csnoel_set_updated_at();

ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.admin_profiles FROM anon, authenticated;
GRANT ALL ON TABLE public.admin_profiles TO service_role;

COMMENT ON TABLE public.admin_profiles IS
  'Private server-managed authorization roles for Supabase Auth users. Browser clients cannot query or modify these roles.';
