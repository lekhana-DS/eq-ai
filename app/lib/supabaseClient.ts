import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Prevents the build process from crashing if keys are missing during compilation
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase environment variables are missing. Database operations will fail.");
}

export const supabase = createClient(
  supabaseUrl || 'supabase.co',
  supabaseAnonKey || 'placeholder-anon-key'
);
