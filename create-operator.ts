import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://eilcqznllmnehrmgbjrb.supabase.co';
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_YQXuf1UkhhqRV-_M4ZC6wA_EAA1lTiW';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function createOperatorBase() {
  console.log('Creating base user via Sandbox Edge Function...');
  const { data, error } = await supabase.functions.invoke('provision-sandbox', {
    body: {
      email: 'operator@guardrail.com',
      password: 'OperatorPassword123!',
      merchantName: 'Temp Operator Org'
    }
  });

  if (error || data?.error) {
    console.error('Failed to create base user:', error?.message || data?.error);
    return;
  }

  console.log('Successfully created base user: operator@guardrail.com');
  console.log('User ID:', data.user.id);
  console.log('\nNow waiting for SQL Editor elevation...');
}

createOperatorBase();
