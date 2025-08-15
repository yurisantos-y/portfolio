import supabaseClient from '../utils/supabaseClient'

export const authService = {
  async loginWithGoogle(redirectPath = '/dashboard') {
    // Persist intended path so callback handler can redirect after session established
    sessionStorage.setItem('intended-path', redirectPath)

    // Determine base site URL: prefer explicit env (set different for prod) else current origin
    const siteUrl = (import.meta.env.VITE_PUBLIC_SITE_URL || import.meta.env.VITE_SITE_URL || window.location.origin).replace(/\/$/, '')
    // Use path-based callback instead of hash for cleaner routing
    const redirectUrl = `${siteUrl}/auth/callback`
    console.log('🔍 Login Debug Info:')
    console.log('- Site URL:', siteUrl)
    console.log('- Redirect URL (path callback):', redirectUrl)
    
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
