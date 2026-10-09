-- Run this file once in the Supabase SQL Editor for the PortfolioGen project.
ALTER TABLE public.portfolios
  ADD COLUMN IF NOT EXISTS id uuid DEFAULT gen_random_uuid(),
  ADD COLUMN IF NOT EXISTS full_name text,
  ADD COLUMN IF NOT EXISTS title text,
  ADD COLUMN IF NOT EXISTS profile_picture text,
  ADD COLUMN IF NOT EXISTS email text,
  ADD COLUMN IF NOT EXISTS contact_number text,
  ADD COLUMN IF NOT EXISTS address text,
  ADD COLUMN IF NOT EXISTS about_me text,
  ADD COLUMN IF NOT EXISTS education text,
  ADD COLUMN IF NOT EXISTS skills text,
  ADD COLUMN IF NOT EXISTS projects text,
  ADD COLUMN IF NOT EXISTS work_experience text,
  ADD COLUMN IF NOT EXISTS social_links text,
  ADD COLUMN IF NOT EXISTS access_token uuid;

CREATE UNIQUE INDEX IF NOT EXISTS portfolios_access_token_unique
ON public.portfolios (access_token)
WHERE access_token IS NOT NULL;

ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow anonymous portfolio submissions"
ON public.portfolios;
DROP POLICY IF EXISTS "Users can read their own portfolios"
ON public.portfolios;
DROP POLICY IF EXISTS "Users can create their own portfolios"
ON public.portfolios;
DROP POLICY IF EXISTS "Users can update their own portfolios"
ON public.portfolios;
DROP POLICY IF EXISTS "Users can delete their own portfolios"
ON public.portfolios;
DROP POLICY IF EXISTS "Public can read portfolios"
ON public.portfolios;
DROP POLICY IF EXISTS "Public can create portfolios"
ON public.portfolios;
DROP POLICY IF EXISTS "Public can update portfolios"
ON public.portfolios;
DROP POLICY IF EXISTS "Public can delete portfolios"
ON public.portfolios;

REVOKE ALL ON TABLE public.portfolios FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.create_portfolio(
  p_access_token uuid,
  p_data jsonb
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
DECLARE
  saved public.portfolios;
BEGIN
  IF p_access_token IS NULL THEN
    RAISE EXCEPTION 'Portfolio access token is required';
  END IF;

  INSERT INTO public.portfolios (
    access_token,
    full_name,
    title,
    profile_picture,
    email,
    contact_number,
    address,
    about_me,
    education,
    skills,
    projects,
    work_experience,
    social_links
  )
  VALUES (
    p_access_token,
    COALESCE(p_data ->> 'full_name', ''),
    NULLIF(p_data ->> 'title', ''),
    NULLIF(p_data ->> 'profile_picture', ''),
    NULLIF(p_data ->> 'email', ''),
    NULLIF(p_data ->> 'contact_number', ''),
    NULLIF(p_data ->> 'address', ''),
    NULLIF(p_data ->> 'about_me', ''),
    NULLIF(p_data ->> 'education', ''),
    NULLIF(p_data ->> 'skills', ''),
    NULLIF(p_data ->> 'projects', ''),
    NULLIF(p_data ->> 'work_experience', ''),
    NULLIF(p_data ->> 'social_links', '')
  )
  RETURNING * INTO saved;

  RETURN to_jsonb(saved) - 'access_token';
END;
$$;

CREATE OR REPLACE FUNCTION public.get_portfolio(p_access_token uuid)
RETURNS jsonb
LANGUAGE sql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
  SELECT to_jsonb(portfolio) - 'access_token'
  FROM public.portfolios AS portfolio
  WHERE portfolio.access_token = p_access_token
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.update_portfolio(
  p_access_token uuid,
  p_data jsonb
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
DECLARE
  saved public.portfolios;
BEGIN
  UPDATE public.portfolios
  SET
    full_name = COALESCE(p_data ->> 'full_name', ''),
    title = NULLIF(p_data ->> 'title', ''),
    profile_picture = NULLIF(p_data ->> 'profile_picture', ''),
    email = NULLIF(p_data ->> 'email', ''),
    contact_number = NULLIF(p_data ->> 'contact_number', ''),
    address = NULLIF(p_data ->> 'address', ''),
    about_me = NULLIF(p_data ->> 'about_me', ''),
    education = NULLIF(p_data ->> 'education', ''),
    skills = NULLIF(p_data ->> 'skills', ''),
    projects = NULLIF(p_data ->> 'projects', ''),
    work_experience = NULLIF(p_data ->> 'work_experience', ''),
    social_links = NULLIF(p_data ->> 'social_links', '')
  WHERE access_token = p_access_token
  RETURNING * INTO saved;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Portfolio not found';
  END IF;

  RETURN to_jsonb(saved) - 'access_token';
END;
$$;

CREATE OR REPLACE FUNCTION public.delete_portfolio(p_access_token uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
DECLARE
  deleted boolean;
BEGIN
  DELETE FROM public.portfolios
  WHERE access_token = p_access_token
  RETURNING true INTO deleted;

  RETURN COALESCE(deleted, false);
END;
$$;

REVOKE ALL ON FUNCTION public.create_portfolio(uuid, jsonb)
FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.get_portfolio(uuid)
FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.update_portfolio(uuid, jsonb)
FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.delete_portfolio(uuid)
FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.create_portfolio(uuid, jsonb)
TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_portfolio(uuid)
TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.update_portfolio(uuid, jsonb)
TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.delete_portfolio(uuid)
TO anon, authenticated;

NOTIFY pgrst, 'reload schema';
