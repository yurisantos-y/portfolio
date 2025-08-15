// Supabase client factory with proper initialization order
import { createClient } from '@supabase/supabase-js'

// Store configuration once
const config = {
  url: null,
  key: null,
  initialized: false
}

// Initialize configuration immediately
function initConfig() {
  if (config.initialized) return config
  
  config.url = import.meta.env.VITE_SUPABASE_URL
  config.key = import.meta.env.VITE_SUPABASE_KEY
  config.initialized = true
  
  return config
}

// Initialize config immediately
initConfig()

// Log configuration status
if (!config.url || !config.key) {
  console.error('Missing Supabase environment variables', {
    url: config.url ? 'Set' : 'Missing',
    key: config.key ? 'Set' : 'Missing',
    env: import.meta.env.MODE
  })
} else {
  console.log('Supabase environment check:', {
    url: 'Set',
    key: 'Set',
    env: import.meta.env.MODE,
    origin: typeof window !== 'undefined' ? window.location.origin : 'SSR'
  })
}

// Create client factory
function createSupabaseInstance() {
  if (!config.url || !config.key) {
    console.warn('Creating mock Supabase client due to missing configuration')
    return createMockClient()
  }

  try {
    const client = createClient(config.url, config.key, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        debug: import.meta.env.DEV,
        storageKey: 'portfolio-supabase-auth',
        flowType: 'pkce'
      },
      global: {
        headers: {
          'X-Client-Info': 'portfolio-app@1.0.0'
        }
      },
      db: {
        schema: 'public'
      },
      realtime: {
        params: {
          eventsPerSecond: 10
        }
      }
    })

    console.log('✅ Supabase client created successfully')
    return client
  } catch (error) {
    console.error('❌ Failed to create Supabase client:', error)
    return createMockClient()
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

// Create and export singleton instance
const supabaseClient = createSupabaseInstance()

export default supabaseClient
export { createSupabaseInstance, config }
