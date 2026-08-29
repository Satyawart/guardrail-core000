-- Migration: Unlock RLS Tenant Mapping
-- Purpose: Safely map auth.uid() to the public.users merchant_id

CREATE OR REPLACE FUNCTION public.auth_merchant_id() RETURNS UUID AS $$
  SELECT merchant_id 
  FROM public.users 
  WHERE id = auth.uid() 
  LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '';
