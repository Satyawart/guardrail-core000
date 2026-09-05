import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_PUBLISHABLE_KEY);

async function test() {
  const { error: authError } = await supabase.auth.signInWithPassword({
    email: 'admin@acme.com',
    password: 'password123'
  });
  if (authError) {
    console.error('Auth error:', authError);
    return;
  }
  
  const { data, error } = await supabase.rpc('get_risk_intelligence', { p_time_range: '7D' });
  console.log('Data:', JSON.stringify(data, null, 2));
  console.log('Error:', error);
}
test();
