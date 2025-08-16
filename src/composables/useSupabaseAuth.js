import { ref, onMounted, onUnmounted } from 'vue'

// Dynamic import to prevent circular dependencies
let supabaseClient = null

async function getSupabaseClient() {
  if (!supabaseClient) {
    const module = await import('../utils/supabaseClient.js')
    supabaseClient = module.default
  }
  return supabaseClient
}

// Create state variables using proper scoping
const user = ref(null)
const session = ref(null)
const loading = ref(true)
let authListener = null

export function useSupabaseAuth() {

  // Verificar a sessão atual
  onMounted(async () => {
    console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL)
    
    try {
      const client = await getSupabaseClient()
      
      // Obter a sessão atual
      const { data } = await client.auth.getSession()
      session.value = data.session
      user.value = data.session?.user || null
      
      loading.value = false
      
      // Inscrever-se para atualizações de autenticação (avoid duplicate listeners)
      if (!authListener) {
        const { data: listener } = client.auth.onAuthStateChange(
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
