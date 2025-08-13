import supabaseClient from '../utils/supabaseClient'

export const authService = {
  async loginWithGoogle(redirectPath = '/dashboard') {
  // Persist intended path so callback handler can redirect after session established
  sessionStorage.setItem('intended-path', redirectPath)

  // Prefer configured site URL (useful when multiple dev origins) else current origin
  const origin = import.meta.env.VITE_SITE_URL || window.location.origin
  // Add a lightweight flag to detect callback scenario reliably
  const redirectUrl = `${origin}/#auth-callback`
  console.log('🔍 Login Debug Info:')
  console.log('- Origin:', origin)
  console.log('- Redirect URL (will receive hash params):', redirectUrl)
    
    const { data, error } = await supabaseClient.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
        skipBrowserRedirect: false,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        }
      }
    })
    
    if (error) {
      console.error('OAuth error:', error);
      throw error;
    }
    
    return data
  },
  
  async logout() {
    return await supabaseClient.auth.signOut()
  },
  
  async getCurrentUser() {
    const { data } = await supabaseClient.auth.getUser()
    if (!data.user) return null
    
    // Verifique se é o usuário autorizado
    const { data: userData, error: userError } = await supabaseClient
      .from('authorized_users')
      .select('id')
      .eq('id', data.user.id)
      .single()
    
    if (userError || !userData) {
      // Faça logout automaticamente se não for um usuário autorizado
      await this.logout()
      return null
    }
    
    return userData ? data.user : null
  }
}
