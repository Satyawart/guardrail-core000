-- Phase 33 Live QA Fix: Grant Execute on auth_merchant_id to Authenticated Role
-- Resolves "permission denied for function auth_merchant_id" in fetchLiveState.

GRANT EXECUTE ON FUNCTION public.auth_merchant_id() TO authenticated;
GRANT EXECUTE ON FUNCTION public.auth_merchant_id() TO anon;
