-- GUARDRAIL CORE: Migration 006 — Grant Minimum Required Table Privileges to authenticated Role
-- Purpose: Resolve "permission denied for table X" errors when the guardrail-engine Edge Function
--          executes under the authenticated PostgreSQL role.
--
-- SECURITY MODEL:
--   - RLS is NOT disabled. This migration does NOT weaken any existing RLS policy.
--   - PostgreSQL evaluates table-level GRANTs BEFORE evaluating RLS policies.
--   - Without a GRANT, PostgreSQL denies access before RLS can run.
--   - Granting a privilege to `authenticated` does NOT bypass RLS — it merely allows
--     PostgreSQL to proceed to RLS evaluation, where merchant_id = auth_merchant_id()
--     continues to enforce strict tenant isolation.
--   - Privileges are scoped to the MINIMUM required by actual application code.
--   - UPDATE is ONLY granted where the schema explicitly allows it (non-append-only tables
--     with existing UPDATE RLS policies).
--   - DELETE is NOT granted to any table. There is no application requirement.
--   - Append-only tables receive INSERT only (not UPDATE or DELETE).

-- Also grant USAGE on the public schema itself, which is required for any table access.
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO anon;

-- ============================================================
-- READ TABLES (SELECT only)
-- ============================================================
-- agent_authority: Engine reads spend_limit, discount_max_percent, refund_max (index.ts line 30-35)
GRANT SELECT ON public.agent_authority TO authenticated;

-- agents: Frontend LiveEngineTestButton reads agent id by name (LiveEngineTestButton.tsx line 13-18)
GRANT SELECT ON public.agents TO authenticated;

-- merchants: Resolved via auth_merchant_id() RPC only; no direct table SELECT from app code.
-- Not granting direct SELECT — the RPC (SECURITY DEFINER) handles this internally.

-- policies: Engine reads active policies (index.ts line 38-42)
GRANT SELECT ON public.policies TO authenticated;

-- policy_versions: Engine reads via join on policies query (index.ts line 40)
GRANT SELECT ON public.policy_versions TO authenticated;

-- users: Auth sync reads from this table via auth_merchant_id() SECURITY DEFINER.
-- The existing "Users Select" RLS policy allows authenticated to read their own row.
GRANT SELECT ON public.users TO authenticated;

-- ============================================================
-- INSERT-ONLY TABLES (Append-Only Ledger — no UPDATE, no DELETE)
-- ============================================================

-- transactions: Engine inserts new transaction record (index.ts line 61-73)
-- Also needs SELECT to return the inserted row via .select('id').single()
GRANT SELECT, INSERT ON public.transactions TO authenticated;

-- policy_evaluations: Engine appends one row per evaluation (index.ts line 89-95)
GRANT INSERT ON public.policy_evaluations TO authenticated;

-- guardrail_decisions: Engine appends final decision (index.ts line 98-103)
GRANT INSERT ON public.guardrail_decisions TO authenticated;

-- audit_events: Engine appends one immutable audit record per decision (index.ts line 115-122)
GRANT INSERT ON public.audit_events TO authenticated;

-- intents: Not currently used by Phase 7 engine; reserved for Phase 8. No grant yet.

-- risk_evaluations: Not currently inserted by the Phase 7 engine; the risk score is computed
-- in memory only and returned in the response payload. No grant yet.

-- payment_attempts: Not used in Phase 7. Reserved for Phase 8 Razorpay integration.

-- settlements: Not used in Phase 7. Reserved for Phase 8.

-- ============================================================
-- CONDITIONALLY MUTABLE TABLES (INSERT + SELECT required now; UPDATE reserved for supervisor flow)
-- ============================================================

-- human_reviews: Engine inserts a PENDING row when decision = REVIEW (index.ts line 107-111)
-- UPDATE will be needed later when a supervisor approves/rejects (Phase 8 supervisor flow).
-- Granting only INSERT and SELECT for now; UPDATE to be added in Phase 8.
GRANT SELECT, INSERT ON public.human_reviews TO authenticated;

-- ============================================================
-- SEQUENCES (required for DEFAULT gen_random_uuid() PKs via INSERT)
-- PostgreSQL requires USAGE on sequences for INSERT operations.
-- gen_random_uuid() is a built-in function, not a sequence, so no additional sequence grants needed.
-- ============================================================

-- ============================================================
-- FUNCTIONS
-- ============================================================
-- auth_merchant_id() is SECURITY DEFINER — no additional grant needed for authenticated to call it.
-- It is already callable via supabase.rpc() from the authenticated client.
