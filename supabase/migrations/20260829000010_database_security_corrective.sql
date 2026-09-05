-- Migration 10: Database Security Corrective
-- Purpose: Safely enforce tenant isolation, apply missing environment columns, fix the authentication trigger, and apply missing RBAC grants.

-- 1. Apply schema requirements for tenant environments and platform operators
ALTER TABLE public.merchants ADD COLUMN IF NOT EXISTS environment TEXT NOT NULL DEFAULT 'PRODUCTION';
ALTER TABLE public.users ALTER COLUMN merchant_id DROP NOT NULL;

-- 2. Correct missing RBAC privileges
-- The authenticated role must be able to read merchant context to evaluate RLS
GRANT SELECT ON public.merchants TO authenticated;

-- 3. Replace insecure authentication trigger
-- The legacy implementation contained a LIMIT 1 fallback that breached tenant isolation.
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
    v_role := COALESCE(new.raw_user_meta_data->>'role', 'viewer');
    
    -- CRITICAL SECURITY FIX: Explicit tenant constraint
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

-- 4. RLS for Platform Operators
-- Add an explicit policy for Platform Operators to manage global merchants. 
-- Using explicit role checks prevents NULL=NULL evaluation vulnerabilities.
DROP POLICY IF EXISTS "Merchants Select Platform" ON public.merchants;
CREATE POLICY "Merchants Select Platform" 
ON public.merchants 
FOR SELECT 
USING (
  (SELECT role FROM public.users WHERE id = auth.uid()) = 'PLATFORM_OPERATOR'
);
