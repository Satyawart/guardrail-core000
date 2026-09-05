-- Migration: Phase 9 Account Architecture Rebuild
-- Purpose: Updates the handle_new_user trigger to support provisioning new isolated Merchant accounts

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  v_merchant_id UUID;
  v_account_type TEXT;
  v_role TEXT;
BEGIN
  -- 1. Read intent from Auth metadata
  v_account_type := new.raw_user_meta_data->>'account_type';

  IF v_account_type = 'MERCHANT_ADMIN' THEN
    -- 2. Create a brand new isolated Merchant
    INSERT INTO public.merchants (name, status)
    VALUES ('Sandbox Organization', 'ACTIVE')
    RETURNING id INTO v_merchant_id;
    
    v_role := 'admin';
  ELSE
    -- 3. Handle invited operators (for future)
    v_merchant_id := (new.raw_user_meta_data->>'merchant_id')::UUID;
    v_role := COALESCE(new.raw_user_meta_data->>'role', 'viewer');
    
    -- Fallback for legacy/existing accounts (prevents breaking existing users)
    IF v_merchant_id IS NULL THEN
      SELECT id INTO v_merchant_id FROM public.merchants WHERE status = 'ACTIVE' ORDER BY created_at ASC LIMIT 1;
    END IF;
  END IF;

  -- 4. Create the application user profile
  INSERT INTO public.users (id, merchant_id, role, email)
  VALUES (new.id, v_merchant_id, v_role, new.email);
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';
