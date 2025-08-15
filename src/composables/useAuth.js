import { ref, computed, onMounted } from 'vue'
import { authService } from '../services/auth'
import supabaseClient from '../utils/supabaseClient'
import router from '../router'

// Initialize reactive state
const user = ref(null)
const loading = ref(true)
const error = ref('')

// Export function to use auth
export function useAuth() {
  const isAuthenticated = computed(() => !!user.value)
  
  const login = async () => {
    try {
      error.value = ''
      loading.value = true
      
      // Check if we're on localhost and get the correct port
      const currentUrl = new URL(window.location.href)
      console.log('Current URL:', currentUrl.href)
      console.log('Current port:', currentUrl.port)
      
      await authService.loginWithGoogle()
    } catch (err) {
      console.error('Login error:', err)
      error.value = err.message || 'Erro ao fazer login'
    } finally {
      loading.value = false
    }
  }
  
  const logout = async () => {
    try {
      await authService.logout()
      user.value = null
    } catch (err) {
      console.error('Logout error:', err)
      error.value = err.message || 'Erro ao fazer logout'
    }
  }
  
  const checkUser = async () => {
    try {
      loading.value = true
      const currentUser = await authService.getCurrentUser()
      user.value = currentUser
    } catch (err) {
      console.error('Check user error:', err)
      user.value = null
    } finally {
      loading.value = false
    }
  }
  
  const initAuth = () => {
    // Listen for auth changes
    const { data: authListener } = supabaseClient.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session)

      if (event === 'SIGNED_IN' && session) {
        await checkUser()
        // Only redirect if user is authorized and not already at dashboard or editing content
        if (user.value) {
          const intendedPath = sessionStorage.getItem('intended-path') || '/dashboard'
          sessionStorage.removeItem('intended-path')
          // Avoid redirect loop if already there
            if (router.currentRoute.value.path !== intendedPath) {
              router.replace(intendedPath).catch(() => {})
            }
        }
      } else if (event === 'SIGNED_OUT') {
        user.value = null
      }
    })
    
    // Check initial auth state
    checkUser()
    
    // Return cleanup function
    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe()
      }
    }
  }
  
  // Initialize on mount
  onMounted(() => {
    initAuth()
  })
  
  return {
    user,
    loading,
    error,
    isAuthenticated,
    login,
    logout,
    checkUser,
    initAuth
  }
}
