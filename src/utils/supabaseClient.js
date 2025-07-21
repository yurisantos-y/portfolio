import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables', {
    url: supabaseUrl ? 'Set' : 'Missing',
    key: supabaseKey ? 'Set' : 'Missing'
  })
}

// Create a single Supabase client instance to avoid multiple GoTrueClient instances
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    // Disable automatic token refresh in development to prevent CORS issues
    debug: process.env.NODE_ENV === 'development',
    // Use current origin to ensure redirect works in all environments
    redirectTo: typeof window !== 'undefined' ? `${window.location.origin}` : undefined,
    // Configure storage key to ensure single instance
    storageKey: 'portfolio-supabase-auth'
  },
  // Add global headers to help with CORS
  global: {
    headers: {
      'X-Client-Info': 'portfolio-app'
    }
  }
}) : {
  // Mock client for development when credentials are missing
  from: () => ({
    select: () => Promise.resolve({ data: [], error: null }),
    insert: () => Promise.resolve({ data: null, error: null }),
    update: () => Promise.resolve({ data: null, error: null }),
    delete: () => Promise.resolve({ data: null, error: null }),
    eq: () => ({ data: null, error: null }),
    order: () => ({ data: [], error: null }),
    single: () => Promise.resolve({ data: null, error: null })
  }),
  auth: {
    getUser: () => Promise.resolve({ data: { user: null }, error: null }),
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    signOut: () => Promise.resolve({ error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } }, error: null })
  }
}

export default supabase
