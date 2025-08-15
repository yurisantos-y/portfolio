// OAuth callback handler
import { useRouter, useRoute } from 'vue-router'
import supabaseClient from '../utils/supabaseClient'

export function useOAuthCallback() {
  const router = useRouter()
  const route = useRoute()
  
  const handleCallback = async () => {
    try {
      console.log('🔄 Processing OAuth callback...')
      console.log('🌐 Current URL:', window.location.href)
      console.log('🏠 Current hostname:', window.location.hostname)
      console.log('🔗 Current origin:', window.location.origin)
      
  // For path-based callback, Supabase returns params in query (?code=...)
  const urlParams = new URLSearchParams(window.location.search)
  console.log('📝 Query params:', Object.fromEntries(urlParams.entries()))
      
      // Handle Supabase auth callback
  let { data, error } = await supabaseClient.auth.getSession()
      
      if (error) {
        console.error('❌ OAuth callback error:', error)
        throw error
      }
      
  // Supabase JS v2 should automatically handle code exchange on redirectTo (PKCE)
  // Extra manual exchange not usually needed for path-based callback.

      if (data.session) {
        console.log('✅ OAuth callback successful, session found')
        console.log('👤 User:', data.session.user?.email)
        
        // Redirect to dashboard or intended page
  const intendedPath = sessionStorage.getItem('intended-path') || '/dashboard'
  sessionStorage.removeItem('intended-path')
        
        console.log('🎯 Redirecting to:', intendedPath)
        
  // Clean up URL parameters (remove code, state from URL)
  window.history.replaceState({}, document.title, '/dashboard')
        
        if (route.path !== intendedPath) {
          await router.replace(intendedPath)
        }
      } else {
        console.log('❌ No session found in callback even after code exchange')
        await router.push('/login')
      }
      
    } catch (error) {
      console.error('❌ OAuth callback failed:', error)
      await router.push('/login?error=oauth_callback_failed')
    }
  }
  
  return {
    handleCallback
  }
}
