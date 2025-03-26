import { ref, onMounted } from 'vue'
import { createClient } from '@supabase/supabase-js'

// Inicialize o cliente Supabase com suas credenciais
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL)
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

export function useSupabaseAuth() {
  const user = ref(null)
  const loading = ref(true)
  
  // Login com Google
  async function loginWithGoogle() {
    try {
      loading.value = true
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        }
      })
      
      if (error) throw error
      
      return { data, error: null }
    } catch (error) {
      return { data: null, error: error.message }
    } finally {
      loading.value = false
    }
  }
  
  // Logout function
  async function logout() {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      user.value = null
      return { error: null }
    } catch (error) {
      return { error: error.message }
    }
  }
  
  // Get current user from Supabase session
  async function getCurrentUser() {
    try {
      loading.value = true
      
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) throw error
      
      if (session?.user) {
        user.value = session.user
        return { user: user.value, error: null }
      } else {
        return { user: null, error: null }
      }
    } catch (error) {
      user.value = null
      return { user: null, error: error.message }
    } finally {
      loading.value = false
    }
  }
  
  // Initialize auth state on component mount
  onMounted(() => {
    // Get initial user state
    getCurrentUser()
    
    // Set up auth state change listener
    supabase.auth.onAuthStateChange((event, session) => {
      user.value = session?.user || null
    })
  })
  
  return {
    user,
    loading,
    loginWithGoogle,
    logout,
    getCurrentUser
  }
}
