import supabaseClient from '../utils/supabaseClient'

export const authService = {
  async loginWithGoogle(redirectPath = '/dashboard') {
    // Define the correct redirect URL based on the environment
    const isProduction = window.location.hostname !== 'localhost';
    
    // Get the current port for development
    const currentPort = window.location.port || (window.location.protocol === 'https:' ? '443' : '80');
    const baseUrl = isProduction 
      ? 'https://yurisantos-y.netlify.app' 
      : `${window.location.protocol}//${window.location.hostname}:${currentPort}`;
    
    const redirectUrl = `${baseUrl}${redirectPath}`;
    
    console.log('Redirect URL:', redirectUrl); // Debug log
    
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
