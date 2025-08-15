import { ref, onMounted, onUnmounted } from 'vue'
import supabaseClient from '../utils/supabaseClient'

// Create state variables using proper scoping
const createAuthState = () => ({
  user: ref(null),
  session: ref(null),
  loading: ref(true),
  authListener: null
})

// Global state instance
let globalAuthState = null

export function useSupabaseAuth() {
  // Initialize global state if not exists
  if (!globalAuthState) {
    globalAuthState = createAuthState()
  }

  const { user, session, loading } = globalAuthState

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
      if (!globalAuthState.authListener) {
        const { data: listener } = supabaseClient.auth.onAuthStateChange(
          (event, newSession) => {
            session.value = newSession
            user.value = newSession?.user || null
          }
        )
        globalAuthState.authListener = listener
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
    if (globalAuthState.authListener && globalAuthState.authListener.subscription) {
      globalAuthState.authListener.subscription.unsubscribe()
      globalAuthState.authListener = null
    }
  }

  // Cleanup on unmount
  onUnmounted(() => {
    // Note: Don't cleanup global state on unmount as it should persist
    // cleanup()
  })

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
