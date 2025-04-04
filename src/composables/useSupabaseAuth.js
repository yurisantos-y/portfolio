import { ref, onMounted } from 'vue'
import supabase from '../utils/supabaseClient'

// Alterando para exportação nomeada para compatibilidade com as importações existentes
export function useSupabaseAuth() {
  const user = ref(null)
  const session = ref(null)
  const loading = ref(true)

  // Verificar a sessão atual
  onMounted(async () => {
    console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL)
    
    // Obter a sessão atual
    const { data } = await supabase.auth.getSession()
    session.value = data.session
    user.value = data.session?.user || null
    
    loading.value = false
    
    // Inscrever-se para atualizações de autenticação
    const { data: authListener } = supabase.auth.onAuthStateChange(
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

// Também fornecemos uma exportação padrão para compatibilidade
export default useSupabaseAuth
