import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
// We need the service role key to bypass RLS, or we can use publishable key and login first.
// The easiest way is to use the service role key which we will pass as VITE_SUPABASE_PUBLISHABLE_KEY when running this.
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  const merchantId = 'dea5d1f8-a1b3-4ce3-9719-9ca2e51db1cf'; // merchant_test@acme.com
  
  const { data: agentData, error: agentError } = await supabase.from('agents').insert({
    merchant_id: merchantId,
    name: 'Chaos Test Agent #1',
    type: 'PROCUREMENT',
    status: 'ACTIVE',
    risk_score: 10
  }).select().single();

  if (agentError) {
    console.error('Error inserting agent:', agentError);
    return;
  }
  
  console.log('Agent inserted:', agentData.id);

  const { data: authData, error: authError } = await supabase.from('agent_authority').insert({
    agent_id: agentData.id,
    merchant_id: merchantId,
    spend_limit: 500000,
    discount_max_percent: 20,
    refund_max: 10000
  }).select();

  if (authError) {
    console.error('Error inserting authority:', authError);
  } else {
    console.log('Authority inserted successfully.');
  }
}

seed();
