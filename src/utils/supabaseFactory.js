// Supabase client factory with proper initialization order
import { createClient } from '@supabase/supabase-js'

// Store configuration once
let config = null;
let clientInstance = null;

// Initialize configuration immediately
function initConfig() {
  if (config) return config;
  
  config = {
    url: import.meta.env.VITE_SUPABASE_URL,
    key: import.meta.env.VITE_SUPABASE_KEY,
    initialized: true
  };
  
  return config;
}

// Get configuration safely
function getConfig() {
  return config || initConfig();
}

// Log configuration status
function logConfigStatus() {
  const cfg = getConfig();
  
  if (!cfg.url || !cfg.key) {
    console.error('Missing Supabase environment variables', {
      url: cfg.url ? 'Set' : 'Missing',
      key: cfg.key ? 'Set' : 'Missing',
      env: import.meta.env.MODE
    });
  } else {
    console.log('Supabase environment check:', {
      url: 'Set',
      key: 'Set',
      env: import.meta.env.MODE,
      origin: typeof window !== 'undefined' ? window.location.origin : 'SSR'
    });
  }
}

// Create client factory
function createSupabaseInstance() {
  // Return existing instance if available
  if (clientInstance) {
    return clientInstance;
  }
  
  const cfg = getConfig();
  
  if (!cfg.url || !cfg.key) {
    console.warn('Creating mock Supabase client due to missing configuration');
    clientInstance = createMockClient();
    return clientInstance;
  }

  try {
    clientInstance = createClient(cfg.url, cfg.key, {
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
    });

    console.log('✅ Supabase client created successfully');
    return clientInstance;
  } catch (error) {
    console.error('❌ Failed to create Supabase client:', error);
    clientInstance = createMockClient();
    return clientInstance;
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
function getSupabaseClient() {
  if (!clientInstance) {
    // Log config status on first access
    logConfigStatus();
    clientInstance = createSupabaseInstance();
  }
  return clientInstance;
}

// Export the factory function as default
const supabaseClient = getSupabaseClient();

export default supabaseClient;
export { createSupabaseInstance, getConfig as config, getSupabaseClient };
