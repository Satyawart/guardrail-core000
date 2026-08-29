-- Migration: Auth Sync Force Backfill
-- Purpose: Safely bypass RLS chicken-and-egg issue to backfill existing auth.users

DO $$
DECLARE
    v_merchant_id UUID;
    v_user RECORD;
BEGIN
    -- 1. Fetch the merchant by temporarily bypassing RLS if necessary
    -- Since DO blocks run as the executing user, if executed by postgres, this works.
    SELECT id INTO v_merchant_id FROM public.merchants LIMIT 1;
    
    IF v_merchant_id IS NULL THEN
        RAISE EXCEPTION 'No merchant found. Cannot backfill users without a merchant.';
    END IF;

    -- 2. Loop through orphaned auth.users and insert
    FOR v_user IN 
        SELECT id, raw_user_meta_data, email 
        FROM auth.users 
        WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE id = auth.users.id)
    LOOP
        INSERT INTO public.users (id, merchant_id, role, email)
        VALUES (
            v_user.id,
            v_merchant_id,
            COALESCE(v_user.raw_user_meta_data->>'role', 'operator'),
            v_user.email
        );
    END LOOP;
END;
$$ LANGUAGE plpgsql;
