-- GUARDRAIL CORE: Migration 012 — Secure Review Workflow RPC
-- Purpose: Safely handle state transitions for Human Reviews and Transactions
-- preventing frontend manipulation, enforcing authorization boundaries,
-- and preventing concurrent race conditions.

CREATE OR REPLACE FUNCTION public.process_review_decision(
  p_review_id UUID,
  p_decision TEXT, -- 'APPROVED' or 'REJECTED'
  p_reason TEXT DEFAULT NULL
) RETURNS JSONB AS $$
DECLARE
  v_review RECORD;
  v_transaction_id UUID;
  v_merchant_id UUID;
  v_reviewer_id UUID;
  v_reviewer_role TEXT;
  v_new_status TEXT;
BEGIN
  -- 1. Identify reviewer and tenant boundaries
  v_reviewer_id := auth.uid();
  IF v_reviewer_id IS NULL THEN
    RAISE EXCEPTION 'Unauthorized: Must be an authenticated user';
  END IF;

  SELECT role INTO v_reviewer_role FROM public.users WHERE id = v_reviewer_id;
  
  -- The merchant_id is constrained unless the user is a PLATFORM_OPERATOR
  v_merchant_id := auth_merchant_id();

  -- 2. Validate requested decision
  IF p_decision = 'APPROVED' THEN
    v_new_status := 'APPROVED';
  ELSIF p_decision = 'REJECTED' THEN
    v_new_status := 'REJECTED';
  ELSE
    RAISE EXCEPTION 'Invalid decision. Must be APPROVED or REJECTED.';
  END IF;

  -- 3. Select and Lock the Review for Update (Prevents concurrent race conditions)
  SELECT * INTO v_review
  FROM public.human_reviews
  WHERE id = p_review_id
  FOR UPDATE;

  IF v_review IS NULL THEN
    RAISE EXCEPTION 'Review item not found.';
  END IF;

  -- 4. Authorization check
  -- If not PLATFORM_OPERATOR, must match the tenant.
  IF v_reviewer_role != 'PLATFORM_OPERATOR' AND v_review.merchant_id != v_merchant_id THEN
    RAISE EXCEPTION 'Unauthorized: Review belongs to a different tenant.';
  END IF;

  -- 5. Verify State Transition Safety
  IF v_review.status != 'PENDING' THEN
    RAISE EXCEPTION 'Invalid state transition: Review is already %', v_review.status;
  END IF;

  -- 6. Execute State Transition
  UPDATE public.human_reviews
  SET status = v_new_status::human_review_status,
      reviewer_id = v_reviewer_id,
      notes = p_reason,
      resolved_at = now()
  WHERE id = p_review_id;

  -- 7. Update Parent Transaction
  UPDATE public.transactions
  SET status = v_new_status::transaction_status
  WHERE id = v_review.transaction_id;

  -- 8. Insert immutable Audit Event
  INSERT INTO public.audit_events (
    merchant_id, entity_type, entity_id, transaction_id, event_type, actor_type, actor_id, metadata
  ) VALUES (
    v_review.merchant_id,
    'TRANSACTION',
    v_review.transaction_id,
    v_review.transaction_id,
    CASE WHEN p_decision = 'APPROVED' THEN 'SUPERVISOR_APPROVAL_EXECUTED' ELSE 'SUPERVISOR_REJECTION_EXECUTED' END,
    CASE WHEN v_reviewer_role = 'PLATFORM_OPERATOR' THEN 'PLATFORM_OPERATOR' ELSE 'SUPERVISOR_ADMIN' END,
    v_reviewer_id,
    jsonb_build_object(
      'decision', p_decision,
      'action', CASE WHEN p_decision = 'APPROVED' THEN 'approveRequest' ELSE 'rejectRequest' END,
      'approvalId', p_review_id,
      'reason', p_reason
    )
  );

  RETURN jsonb_build_object('success', true, 'status', v_new_status);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';
