-- Migration: Auth Sync Trigger
-- Purpose: Automatically syncs new Supabase auth.users to public.users

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  v_merchant_id UUID;
BEGIN
  -- Try to extract a specific merchant_id from user metadata (e.g. via invite)
  v_merchant_id := (new.raw_user_meta_data->>'merchant_id')::uuid;
  
  -- Sandbox fallback: If no merchant is specified, assign to the first available merchant.
  -- In a strict production environment, this fallback might be removed.
  IF v_merchant_id IS NULL THEN
    SELECT id INTO v_merchant_id FROM public.merchants LIMIT 1;
  END IF;

  INSERT INTO public.users (id, merchant_id, role, email)
  VALUES (
    new.id, 
    v_merchant_id,
    COALESCE(new.raw_user_meta_data->>'role', 'operator'), -- default to operator for sandbox
    new.email
  );
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to fire on every new signup in Supabase Auth
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
