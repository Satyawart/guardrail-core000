// @ts-nocheck
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';
import { corsHeaders } from '../guardrail-engine/cors.ts';

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { email, password, merchantName } = await req.json();

    if (!email || !password || !merchantName) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: email, password, merchantName' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Initialize Supabase Admin Client using Service Role Key
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Missing environment variables: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
      return new Response(
        JSON.stringify({ error: 'Internal Server Configuration Error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
    
    // PRE-CHECK: Query public.users to see if email already exists
    const { data: existingUser, error: checkError } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', normalizedEmail)
      .maybeSingle();
      
    if (existingUser) {
      return new Response(
        JSON.stringify({ error: 'An account with this email already exists.', code: 'DUPLICATE_ACCOUNT' }),
        { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Attempt to create user with email_confirm: true to bypass email requirements for testing
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: normalizedEmail,
      password,
      email_confirm: true,
      user_metadata: {
        account_type: 'SANDBOX_MERCHANT_ADMIN',
        merchant_name: merchantName
      }
    });

    if (error) {
      console.error("Supabase Admin Auth Error:", error);
      
      // If createUser inherently returns a duplicate account error, handle it explicitly
      if (error.status === 422 || error.status === 400 || error.message?.toLowerCase().includes('already registered')) {
         return new Response(
          JSON.stringify({ error: 'An account with this email already exists.', code: 'DUPLICATE_ACCOUNT' }),
          { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      // Supabase normally returns useful status codes
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: error.status || 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Resolve the newly created merchant_id from public.users
    let merchantId: string | null = null;
    for (let i = 0; i < 5; i++) {
      const { data: userRow } = await supabaseAdmin
        .from('users')
        .select('merchant_id')
        .eq('id', data.user.id)
        .single();
      if (userRow?.merchant_id) {
        merchantId = userRow.merchant_id;
        break;
      }
      await new Promise(r => setTimeout(r, 200));
    }

    if (merchantId) {
      // Seed default active agent
      const { data: agentRow } = await supabaseAdmin
        .from('agents')
        .insert({
          merchant_id: merchantId,
          name: 'AI Buyer #17',
          type: 'Autonomous Procurement',
          status: 'ACTIVE',
          risk_score: 4
        })
        .select()
        .single();

      if (agentRow) {
        await supabaseAdmin.from('agent_authority').insert({
          agent_id: agentRow.id,
          merchant_id: merchantId,
          spend_limit: 500000,
          discount_max_percent: 10,
          refund_max: 5000
        });
      }

      // Seed default policy
      const { data: polRow } = await supabaseAdmin
        .from('policies')
        .insert({
          merchant_id: merchantId,
          name: 'Margin Floor Guard',
          category: 'MARGIN',
          status: 'ACTIVE'
        })
        .select()
        .single();

      if (polRow) {
        await supabaseAdmin.from('policy_versions').insert({
          policy_id: polRow.id,
          merchant_id: merchantId,
          version_number: 1,
          natural_language: 'Block any discount where net margin falls below 15.0%',
          code_snippet: 'if (discount > 10) return BLOCK;'
        });
      }
    }

    return new Response(
      JSON.stringify({ success: true, user: data.user, merchantId }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Unhandled Edge Function Error:', error);
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred during sandbox provisioning.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
