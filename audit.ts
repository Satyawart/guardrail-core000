import { Client } from 'pg';

const client = new Client({
  host: 'aws-0-ap-northeast-2.pooler.supabase.com',
  port: 5432,
  user: 'cli_login_postgres.eilcqznllmnehrmgbjrb',
  password: 'k18p3UZQAaKPQbVFB8cUH3v51edxu7xu',
  database: 'postgres',
  ssl: { rejectUnauthorized: false }
});

async function run() {
  await client.connect();
  
  console.log("=== 1. REMOTE PERMISSION AUDIT ===");
  const perms = await client.query(`
    SELECT grantee, privilege_type
    FROM information_schema.role_table_grants 
    WHERE table_name = 'merchants' AND table_schema = 'public'
    ORDER BY grantee;
  `);
  console.log("public.merchants grants:", perms.rows);

  const userPerms = await client.query(`
    SELECT grantee, privilege_type
    FROM information_schema.role_table_grants 
    WHERE table_name = 'users' AND table_schema = 'public'
    ORDER BY grantee;
  `);
  console.log("public.users grants:", userPerms.rows);
  
  console.log("\n=== 2. REMOTE RLS AUDIT ===");
  const rls = await client.query(`
    SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
    FROM pg_policies 
    WHERE schemaname = 'public' AND tablename IN ('merchants', 'users', 'agents', 'transactions');
  `);
  console.log("RLS Policies:", rls.rows);

  const rlsEnabled = await client.query(`
    SELECT relname, relrowsecurity, relforcerowsecurity 
    FROM pg_class 
    WHERE relname IN ('merchants', 'users');
  `);
  console.log("RLS Enabled:", rlsEnabled.rows);
  
  console.log("\n=== 3. REMOTE ROLE AUDIT ===");
  const roles = await client.query(`
    SELECT conname, pg_get_constraintdef(c.oid)
    FROM pg_constraint c
    JOIN pg_class t ON c.conrelid = t.oid
    WHERE t.relname = 'users';
  `);
  console.log("Users Constraints:", roles.rows);
  
  const roleType = await client.query(`
    SELECT column_name, data_type, character_maximum_length, column_default 
    FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'role';
  `);
  console.log("Role Column:", roleType.rows);

  console.log("\n=== 4. REMOTE TRIGGER AUDIT ===");
  const triggerFunc = await client.query(`
    SELECT pg_get_functiondef(p.oid) as func_def
    FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname = 'public' AND p.proname = 'handle_new_user';
  `);
  console.log("handle_new_user:", triggerFunc.rows[0]?.func_def);

  console.log("\n=== 5. REMOTE ENVIRONMENT AUDIT ===");
  const envCol = await client.query(`
    SELECT column_name, data_type, is_nullable, column_default 
    FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'merchants' AND column_name = 'environment';
  `);
  console.log("Merchants Env Column:", envCol.rows);

  console.log("\n=== 6. POLLUTED ACCOUNT AUDIT ===");
  try {
    const polluted = await client.query(`
      SELECT u.id, u.email, u.merchant_id, u.role, u.created_at, m.name AS merchant_name
      FROM public.users u
      JOIN public.merchants m ON u.merchant_id = m.id
      WHERE u.merchant_id = '18720799-f42e-4a85-89f2-c701f80d1f38' 
      AND u.email LIKE '%@test.com%';
    `);
    console.log("Polluted Accounts:", polluted.rows);
  } catch (e) {
    console.log("Polluted Accounts Query Failed (Insufficient Privileges):", (e as Error).message);
  }
  
  console.log("\n=== 7. AUTH_MERCHANT_ID AUDIT ===");
  const authMerchantId = await client.query(`
    SELECT pg_get_functiondef(p.oid) as func_def
    FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname = 'public' AND p.proname = 'auth_merchant_id';
  `);
  console.log("auth_merchant_id:", authMerchantId.rows[0]?.func_def);

  await client.end();
}

run().catch(console.error);
