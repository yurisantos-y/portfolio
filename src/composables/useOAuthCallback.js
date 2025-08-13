// OAuth callback handler
import { useRouter } from 'vue-router'
import supabaseClient from '../utils/supabaseClient'

export function useOAuthCallback() {
  const router = useRouter()
  
  const handleCallback = async () => {
    try {
      console.log('🔄 Processing OAuth callback...')
      console.log('🌐 Current URL:', window.location.href)
      console.log('🏠 Current hostname:', window.location.hostname)
      console.log('🔗 Current origin:', window.location.origin)
      
      // Check if we have auth callback parameters
      const urlParams = new URLSearchParams(window.location.search)
      const hashParams = new URLSearchParams(window.location.hash.substring(1))
      
      console.log('📝 URL params:', Object.fromEntries(urlParams.entries()))
      console.log('📝 Hash params:', Object.fromEntries(hashParams.entries()))
      
      // Handle Supabase auth callback
      const { data, error } = await supabaseClient.auth.getSession()
      
      if (error) {
        console.error('❌ OAuth callback error:', error)
        throw error
      }
      
      if (data.session) {
        console.log('✅ OAuth callback successful, session found')
        console.log('👤 User:', data.session.user?.email)
        
        // Redirect to dashboard or intended page
        const intendedPath = sessionStorage.getItem('intended-path') || '/dashboard'
        sessionStorage.removeItem('intended-path')
        
        console.log('🎯 Redirecting to:', intendedPath)
        
        // Clean up URL parameters
        window.history.replaceState({}, document.title, window.location.pathname)
        
        await router.push(intendedPath)
      } else {
        console.log('❌ No session found in callback')
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
