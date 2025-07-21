import { ref, onMounted } from 'vue'
import supabaseClient from '../utils/supabaseClient'

// Shared state to avoid multiple instances
let user = ref(null)
let session = ref(null)
let loading = ref(true)
let authListener = null

export function useSupabaseAuth() {
  // Verificar a sessão atual
  onMounted(async () => {
    console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL)
    
    try {
      // Obter a sessão atual
      const { data } = await supabaseClient.auth.getSession()
      session.value = data.session
      user.value = data.session?.user || null
      
      loading.value = false
      
      // Inscrever-se para atualizações de autenticação (avoid duplicate listeners)
      if (!authListener) {
        const { data: listener } = supabaseClient.auth.onAuthStateChange(
          (event, newSession) => {
            session.value = newSession
            user.value = newSession?.user || null
          }
        )
        authListener = listener
      }
    } catch (error) {
      console.error('Error initializing auth:', error)
      loading.value = false
    }
  })

  // Função para verificar se o usuário está autenticado
  const isAuthenticated = () => {
    return !!user.value && !!session.value
  }

  // Cleanup function
  const cleanup = () => {
    if (authListener && authListener.subscription) {
      authListener.subscription.unsubscribe()
      authListener = null
    }
  }

  return {
    user,
    session,
    loading,
    isAuthenticated,
    cleanup
  }
}

// Export as default for compatibility
export default useSupabaseAuth
