import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_KEY;

// Check if environment variables are set
if (!supabaseUrl) {
  console.error('Missing environment variable: VITE_SUPABASE_URL');
}

if (!supabaseAnonKey) {
  console.error('Missing environment variable: VITE_SUPABASE_KEY');
}

// Create a mocked client during development if credentials are missing
let supabase;

if (!supabaseUrl || !supabaseAnonKey) {
  // Provide a mock implementation to prevent crashes during development
  console.warn('Using mock Supabase client due to missing credentials.');
  supabase = {
    from: () => ({
      select: () => ({ data: [], error: null }),
      insert: () => ({ data: null, error: null }),
      update: () => ({ data: null, error: null }),
      delete: () => ({ data: null, error: null }),
      eq: () => ({ data: null, error: null }),
      order: () => ({ data: [], error: null }),
      single: () => ({ data: null, error: null })
    }),
    auth: {
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      signOut: () => Promise.resolve({ error: null })
    }
  };
} else {
  // Create the real Supabase client if credentials are available
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export { supabase };
