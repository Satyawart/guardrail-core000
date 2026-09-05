-- Migration: Phase 10 Auth Architecture Stabilization
-- Purpose: Remove unsafe fallbacks, standardize roles, support explicit environments and platform operators.

-- 1. Make merchant_id nullable to support Platform Operators who exist above the merchant tenant layer
ALTER TABLE public.users ALTER COLUMN merchant_id DROP NOT NULL;

-- 2. Add explicit environment tracking to merchants
ALTER TABLE public.merchants ADD COLUMN IF NOT EXISTS environment TEXT NOT NULL DEFAULT 'PRODUCTION';

-- 3. Rewrite handle_new_user to enforce strict context and remove unsafe fallback
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  v_merchant_id UUID;
  v_account_type TEXT;
  v_role TEXT;
  v_merchant_name TEXT;
BEGIN
  -- Read intent from Auth metadata
  v_account_type := new.raw_user_meta_data->>'account_type';
  v_merchant_name := COALESCE(new.raw_user_meta_data->>'merchant_name', 'Sandbox Organization');

  IF v_account_type = 'SANDBOX_MERCHANT_ADMIN' THEN
    -- Provision a brand new isolated Sandbox Merchant
    INSERT INTO public.merchants (name, status, environment)
    VALUES (v_merchant_name, 'ACTIVE', 'SANDBOX')
    RETURNING id INTO v_merchant_id;
    
    v_role := 'MERCHANT_ADMIN';
    
  ELSIF v_account_type = 'PLATFORM_OPERATOR' THEN
    -- Platform Operators do not belong to a merchant tenant
    v_merchant_id := NULL;
    v_role := 'PLATFORM_OPERATOR';
    
  ELSE
    -- Standard merchant user invite flow
    v_merchant_id := (new.raw_user_meta_data->>'merchant_id')::UUID;
    v_role := COALESCE(new.raw_user_meta_data->>'role', 'MERCHANT_VIEWER');
    
    -- CRITICAL SECURITY FIX: Remove the 'LIMIT 1' fallback. 
    -- If no context is provided, fail the provisioning to prevent cross-tenant leakage.
    IF v_merchant_id IS NULL THEN
      RAISE EXCEPTION 'Missing merchant_id context for new user. Unassigned accounts are forbidden.';
    END IF;
  END IF;

  -- Create the application user profile
  INSERT INTO public.users (id, merchant_id, role, email)
  VALUES (new.id, v_merchant_id, v_role, new.email);
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- 4. Update auth_merchant_id() to safely handle Platform Operators
CREATE OR REPLACE FUNCTION public.auth_merchant_id() RETURNS UUID AS $$
  SELECT merchant_id 
  FROM public.users 
  WHERE id = auth.uid() 
  LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '';

-- Note: RLS policies using `merchant_id = auth_merchant_id()` will naturally block PLATFORM_OPERATORS
-- from standard merchant queries because NULL = NULL evaluates to NULL (falsy) in SQL.
-- If platform operators need global read access later, RLS policies will need explicit OR role = 'PLATFORM_OPERATOR' conditions.
