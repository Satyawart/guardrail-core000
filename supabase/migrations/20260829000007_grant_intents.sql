-- GUARDRAIL CORE: Migration 007 — Phase 8 Intents Integration Grants
-- Purpose: Grant minimum required privileges on public.intents to the authenticated role.
--
-- SECURITY MODEL:
--   - RLS is NOT disabled. The existing "Intents Select" and "Intents Insert" RLS policies
--     already enforce merchant_id = auth_merchant_id() tenant isolation.
--   - This GRANT only allows PostgreSQL to reach RLS evaluation. Without it, all access is
--     denied at the table-privilege layer before RLS can run.
--   - intents is an append-only table: no UPDATE or DELETE is granted.
--   - The merchant_id on every INSERT is always resolved server-side via auth_merchant_id()
--     inside the Edge Function — never trusted from the frontend payload.

GRANT SELECT, INSERT ON public.intents TO authenticated;
