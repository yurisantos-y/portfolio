import { ref, onMounted } from 'vue'
import supabaseClient from '../utils/supabaseClient'

// Shared state to avoid multiple instances
const user = ref(null)
const session = ref(null)
const loading = ref(true)

export function useSupabaseAuth() {
  // Verificar a sessão atual
  onMounted(async () => {
    console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL)
    
    // Obter a sessão atual
    const { data } = await supabaseClient.auth.getSession()
    session.value = data.session
    user.value = data.session?.user || null
    
    loading.value = false
    
    // Inscrever-se para atualizações de autenticação
    const { data: authListener } = supabaseClient.auth.onAuthStateChange(
      (event, newSession) => {
        session.value = newSession
        user.value = newSession?.user || null
      }
    )
    
    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe()
      }
    }
  })

  // Função para verificar se o usuário está autenticado
  const isAuthenticated = () => {
    return !!user.value && !!session.value
  }

  return {
    user,
    session,
    loading,
    isAuthenticated
  }
}

// Default export
export default useSupabaseAuth
