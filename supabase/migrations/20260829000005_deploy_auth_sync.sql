-- Migration: Deploy Secure Auth Sync & Backfill
-- Purpose: Creates the missing handle_new_user trigger securely and backfills existing auth.users

-- 1. Create the secure zero-trust sync function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  v_merchant_id UUID;
BEGIN
  -- Deterministically select the sandbox merchant (the primary active organization).
  SELECT id INTO v_merchant_id 
  FROM public.merchants 
  WHERE status = 'ACTIVE' 
  ORDER BY created_at ASC 
  LIMIT 1;

  IF v_merchant_id IS NULL THEN
    RAISE EXCEPTION 'Cannot provision user: No active sandbox merchant available.';
  END IF;

  -- The role is strictly hardcoded to 'viewer'
  INSERT INTO public.users (id, merchant_id, role, email)
  VALUES (
    new.id, 
    v_merchant_id,
    'viewer',
    new.email
  );
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- 2. Bind the trigger to Supabase Auth
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Idempotently backfill existing auth users securely
DO $$
DECLARE
    v_merchant_id UUID;
    v_user RECORD;
BEGIN
    SELECT id INTO v_merchant_id 
    FROM public.merchants 
    WHERE status = 'ACTIVE' 
    ORDER BY created_at ASC 
    LIMIT 1;
    
    IF v_merchant_id IS NULL THEN
        RAISE NOTICE 'No active sandbox merchant found. Skipping backfill.';
        RETURN;
    END IF;

    FOR v_user IN 
        SELECT id, email 
        FROM auth.users au
        WHERE NOT EXISTS (SELECT 1 FROM public.users pu WHERE pu.id = au.id)
    LOOP
        INSERT INTO public.users (id, merchant_id, role, email)
        VALUES (
            v_user.id,
            v_merchant_id,
            'viewer',
            v_user.email
        );
    END LOOP;
END;
$$ LANGUAGE plpgsql;
