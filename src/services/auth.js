import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

export const authService = {
  async loginWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`
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
