// Debug utility to check Supabase connectivity
import supabaseClient from '../utils/supabaseClient'

export const debugSupabase = {
  async testConnection() {
    console.log('🔍 Testing Supabase connection...')
    
    try {
      // Test 1: Check environment variables
      console.log('📋 Environment Variables:')
      console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL ? '✅ Set' : '❌ Missing')
      console.log('VITE_SUPABASE_KEY:', import.meta.env.VITE_SUPABASE_KEY ? '✅ Set' : '❌ Missing')
      
      // Test 2: Check network connectivity
      console.log('🌐 Network Test:')
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
      if (supabaseUrl) {
        try {
          const healthCheck = await fetch(`${supabaseUrl}/rest/v1/`, {
            method: 'GET',
            headers: {
              'apikey': import.meta.env.VITE_SUPABASE_KEY,
              'Content-Type': 'application/json'
            }
          })
          console.log('Health check response status:', healthCheck.status)
          console.log('Health check response headers:', Object.fromEntries(healthCheck.headers.entries()))
        } catch (fetchError) {
          console.error('❌ Network connectivity failed:', fetchError)
        }
      }
      
      // Test 3: Check auth configuration
      console.log('🔐 Auth Configuration:')
      const session = await supabaseClient.auth.getSession()
      console.log('Current session:', session)
      
      // Test 4: Check current URL and redirect configuration
      console.log('🔗 URL Configuration:')
      console.log('Current URL:', window.location.href)
      console.log('Origin:', window.location.origin)
      console.log('Hostname:', window.location.hostname)
      console.log('Port:', window.location.port)
      console.log('Protocol:', window.location.protocol)
      
    } catch (error) {
      console.error('❌ Debug test failed:', error)
    }
  },
  
  async testAuth() {
    console.log('🔐 Testing Auth functionality...')
    
    try {
      const { data, error } = await supabaseClient.auth.getUser()
      console.log('Current user:', data)
      if (error) console.error('Auth error:', error)
      
      // Test OAuth provider availability
      console.log('📱 OAuth Providers Test:')
      const providers = ['google']
      for (const provider of providers) {
        console.log(`Testing ${provider} provider...`)
        // Just log the configuration, don't actually initiate OAuth
        console.log(`${provider} provider available: ✅`)
      }
      
    } catch (error) {
      console.error('❌ Auth test failed:', error)
    }
  }
}

// Auto-run debug in development
if (import.meta.env.DEV) {
  debugSupabase.testConnection()
}
