import supabase from '../utils/supabaseClient'

export const authService = {
  async loginWithGoogle(redirectPath = '/dashboard') {
    // Define the correct redirect URL based on the environment
    const isProduction = window.location.hostname !== 'localhost';
    const redirectUrl = isProduction 
      ? `https://yurisantos-y.netlify.app${redirectPath}` 
      : `${window.location.origin}${redirectPath}`;
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl
      }
    })
    
    if (error) throw error
    
    return data
  },
  
  async logout() {
    return await supabase.auth.signOut()
  },
  
  async getCurrentUser() {
    const { data } = await supabase.auth.getUser()
    if (!data.user) return null
    
    // Verifique se é o usuário autorizado
    const { data: userData, error: userError } = await supabase
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
