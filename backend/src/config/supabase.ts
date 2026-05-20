import { createClient } from '@supabase/supabase-js';
import { env } from './env.js';
import type { Database } from '../database/database.types.js';

// Service role client — used for all backend operations.
// Bypasses RLS. Never expose this key to the frontend.
export const supabaseAdmin = createClient<Database>(
  env.SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
);

// Anon client — used only for auth flows that need the public key
// (signInWithPassword, resetPasswordForEmail).
export const supabaseAnon = createClient<Database>(
  env.SUPABASE_URL,
  env.SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
);
