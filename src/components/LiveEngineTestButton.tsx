import React, { useState } from 'react';
import { invokeGuardrailEngine } from '../utils/engine';
import { supabase } from '../utils/supabase';

export const LiveEngineTestButton: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const runTest = async () => {
    setLoading(true);
    setResult(null);
    try {
      // --- DIAGNOSTIC: Session ---
      const { data: { session } } = await supabase.auth.getSession();
      console.group('🔍 LIVE ENGINE DIAGNOSTIC');
      console.log('1. session.user.id:', session?.user?.id ?? 'NO SESSION');

      // --- DIAGNOSTIC: Merchant resolver ---
      const { data: merchantId, error: merchantError } = await supabase.rpc('auth_merchant_id');
      console.log('2. auth_merchant_id():', merchantId, merchantError ? `ERROR: ${merchantError.message}` : '');

      if (!session?.user) {
        throw new Error('DIAGNOSTIC: No authenticated session found. Please log in.');
      }
      if (!merchantId) {
        throw new Error('DIAGNOSTIC: auth_merchant_id() returned null. RLS resolver is broken.');
      }

      // --- Agent lookup: Use maybeSingle() so zero rows returns null instead of throwing ---
      const { data: agent, error: agentError } = await supabase
        .from('agents')
        .select('id, name, merchant_id')
        .eq('name', 'Live Test Agent #01')
        .maybeSingle();

      console.log('3. agents query data:', agent);
      console.log('4. agents query error:', agentError?.message ?? 'none');
      console.groupEnd();

      if (agentError) {
        throw new Error(`Agent query failed (possible RLS denial): ${agentError.message}`);
      }
      if (!agent) {
        throw new Error(
          `Agent "Live Test Agent #01" not found under merchant ${merchantId}. ` +
          `Session user: ${session.user.id}. ` +
          `Run seed_test_data.sql and verify agent.merchant_id matches public.users.merchant_id.`
        );
      }

      // --- Fire the Engine ---
      const payload = {
        agentId: agent.id,
        intent: 'Test procurement of 5 laptops',
        proposedAmount: 320000,
        proposedDiscount: 5.0,
        estimatedCostBasis: 260000,
        idempotencyKey: `test_idemp_${Date.now()}`
      };

      console.log('FIRING LIVE TRANSACTION...', payload);
      const res = await invokeGuardrailEngine(payload);
      setResult(res);
      console.log('LIVE ENGINE RESULT:', res);
    } catch (err: any) {
      console.error('LiveEngineTest error:', err.message);
      setResult({ error: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-[#111113] border border-blue-500/30 p-4 rounded-lg shadow-2xl">
      <h3 className="text-blue-400 font-mono text-sm mb-2">Phase 7: Live Engine Test</h3>
      <button
        onClick={runTest}
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded font-mono text-xs w-full transition-colors"
      >
        {loading ? 'EXECUTING...' : 'FIRE LIVE TRANSACTION'}
      </button>
      {result && (
        <pre className="mt-2 text-[10px] text-gray-400 max-w-xs overflow-auto bg-black p-2 rounded max-h-32 border border-gray-800">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
};
