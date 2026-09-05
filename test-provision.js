import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_PUBLISHABLE_KEY);

async function test() {
  const { data, error } = await supabase.functions.invoke('provision-sandbox', {
    body: {
      email: 'merchant_test@acme.com',
      password: 'password123',
      merchantName: 'Acme Test'
    }
  });
  console.log('Data:', data);
  console.log('Error:', error);
}
test();
