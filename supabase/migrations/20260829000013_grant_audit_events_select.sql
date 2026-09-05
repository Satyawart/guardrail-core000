-- GUARDRAIL CORE: Migration 013 — Grant Audit Events Select
-- Purpose: Safely open SELECT privileges on the audit_events table to the authenticated role.
-- RLS policies already present securely bound access to auth_merchant_id().

GRANT SELECT ON public.audit_events TO authenticated;
