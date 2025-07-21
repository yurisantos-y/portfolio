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
const supabaseClient = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    debug: process.env.NODE_ENV === 'development',
    // Use current origin to ensure redirect works in all environments
    redirectTo: typeof window !== 'undefined' ? window.location.origin : undefined,
    // Configure storage key to ensure single instance
    storageKey: 'portfolio-supabase-auth',
    // Additional flow type for better compatibility
    flowType: 'pkce'
  },
  // Add global headers to help with CORS and connectivity
  global: {
    headers: {
      'X-Client-Info': 'portfolio-app',
      'Access-Control-Allow-Origin': '*'
    }
  },
  // Database options for better connection handling
  db: {
    schema: 'public'
  },
  // Realtime options
  realtime: {
    params: {
      eventsPerSecond: 10
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

export default supabaseClient
