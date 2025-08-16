// Simplified Supabase client factory
import { createClient } from '@supabase/supabase-js'

// Configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY

// Validate environment variables
if (!supabaseUrl || !supabaseKey) {
  console.warn('Missing Supabase environment variables', {
    url: supabaseUrl ? 'Set' : 'Missing',
    key: supabaseKey ? 'Set' : 'Missing',
    env: import.meta.env.MODE
  })
}

// Create client instance
let clientInstance = null

function createSupabaseClient() {
  if (clientInstance) {
    return clientInstance
  }

  if (!supabaseUrl || !supabaseKey) {
    console.warn('Creating mock Supabase client due to missing configuration')
    clientInstance = createMockClient()
    return clientInstance
  }

  try {
    clientInstance = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        storageKey: 'portfolio-supabase-auth',
        flowType: 'pkce'
      }
    })

    console.log('✅ Supabase client created successfully')
    return clientInstance
  } catch (error) {
    console.error('❌ Failed to create Supabase client:', error)
    clientInstance = createMockClient()
    return clientInstance
  }
}

// Mock client for fallback
function createMockClient() {
  return {
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
      signInWithOAuth: () => Promise.resolve({ 
        data: null, 
        error: new Error('Supabase not configured') 
      }),
      onAuthStateChange: () => ({ 
        data: { 
          subscription: { 
            unsubscribe: () => {} 
          } 
        }, 
        error: null 
      })
    }
  }
}

// Export the client
const supabaseClient = createSupabaseClient()
export default supabaseClient
