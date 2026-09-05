-- Phase 33 QA Fix: Cast string literals to ENUM types for process_review_decision

CREATE OR REPLACE FUNCTION process_review_decision(p_transaction_id UUID, p_decision TEXT, p_reason TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_merchant_id UUID;
    v_actor_email TEXT;
    v_review_exists BOOLEAN;
BEGIN
    v_merchant_id := auth_merchant_id();
    v_actor_email := (current_setting('request.jwt.claims', true)::jsonb ->> 'email')::TEXT;

    IF v_merchant_id IS NULL THEN
        RAISE EXCEPTION 'Unauthorized: Merchant ID could not be resolved';
    END IF;

    IF p_decision NOT IN ('APPROVE', 'REJECT') THEN
        RAISE EXCEPTION 'Invalid decision. Must be APPROVE or REJECT.';
    END IF;

    -- Check if review exists and is pending
    SELECT EXISTS (
        SELECT 1 FROM human_reviews 
        WHERE transaction_id = p_transaction_id 
        AND merchant_id = v_merchant_id 
        AND status = 'PENDING'
    ) INTO v_review_exists;

    IF NOT v_review_exists THEN
        RAISE EXCEPTION 'Review not found or already processed.';
    END IF;

    -- Update Review
    UPDATE human_reviews
    SET status = (CASE WHEN p_decision = 'APPROVE' THEN 'APPROVED' ELSE 'REJECTED' END)::human_review_status,
        reviewed_by = v_actor_email,
        reviewed_at = now(),
        notes = p_reason
    WHERE transaction_id = p_transaction_id;

    -- Update Transaction Status
    UPDATE transactions
    SET status = (CASE WHEN p_decision = 'APPROVE' THEN 'APPROVED' ELSE 'REJECTED' END)::transaction_status,
        updated_at = now()
    WHERE id = p_transaction_id;
    
    -- Insert Audit Event
    INSERT INTO audit_events (merchant_id, event_type, actor_type, actor_id, entity_type, entity_id, transaction_id, metadata, hash)
    VALUES (
        v_merchant_id,
        'SUPERVISOR_REVIEW',
        'USER',
        v_actor_email,
        'TRANSACTION',
        p_transaction_id,
        p_transaction_id,
        jsonb_build_object('decision', p_decision, 'reason', p_reason),
        encode(digest(p_transaction_id::text || p_decision || now()::text, 'sha256'), 'hex')
    );

    RETURN jsonb_build_object('success', true, 'status', CASE WHEN p_decision = 'APPROVE' THEN 'APPROVED' ELSE 'REJECTED' END);
END;
$$;
