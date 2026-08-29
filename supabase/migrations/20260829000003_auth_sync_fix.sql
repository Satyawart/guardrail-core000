-- Migration: Auth Sync Fix
-- Purpose: Hardens the sync trigger and backfills orphaned auth.users accounts.

-- 1. Secure the trigger function for future users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  v_merchant_id UUID;
BEGIN
  v_merchant_id := (new.raw_user_meta_data->>'merchant_id')::uuid;
  
  IF v_merchant_id IS NULL THEN
    SELECT id INTO v_merchant_id FROM public.merchants LIMIT 1;
  END IF;

  INSERT INTO public.users (id, merchant_id, role, email)
  VALUES (
    new.id, 
    v_merchant_id,
    COALESCE(new.raw_user_meta_data->>'role', 'operator'),
    new.email
  );
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- 2. Backfill existing orphaned users
-- This safely inserts a public.users row for any auth.users that don't have one yet.
INSERT INTO public.users (id, merchant_id, role, email)
SELECT 
    au.id,
    (SELECT id FROM public.merchants LIMIT 1),
    COALESCE(au.raw_user_meta_data->>'role', 'operator'),
    au.email
FROM auth.users au
WHERE NOT EXISTS (
    SELECT 1 FROM public.users pu WHERE pu.id = au.id
);
