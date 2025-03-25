import { ref, onMounted } from 'vue'
// We don't need Supabase anymore for static authentication

export function useSupabaseAuth() {
  const user = ref(null)
  const loading = ref(true)
  
  // Static credentials
  const STATIC_EMAIL = 'yuri01.sp@gmail.com'
  const STATIC_PASSWORD = '950552953@Yuri'
  
  // Login with static credentials
  async function login(email, password) {
    try {
      loading.value = true
      
      // Check if provided credentials match our static credentials
      if (email === STATIC_EMAIL && password === STATIC_PASSWORD) {
        // Create a user object similar to what Supabase would return
        const userData = {
          id: '1',
          email: STATIC_EMAIL,
          user_metadata: {
            name: 'Yuri Santos'
          }
        }
        
        user.value = userData
        
        // Store authentication state in localStorage to persist across page reloads
        localStorage.setItem('authUser', JSON.stringify(userData))
        
        return { user: userData, error: null }
      } else {
        throw new Error('Credenciais inválidas')
      }
    } catch (error) {
      return { user: null, error: error.message }
    } finally {
      loading.value = false
    }
  }
  
  // Logout function
  async function logout() {
    try {
      user.value = null
      // Clear stored authentication
      localStorage.removeItem('authUser')
      return { error: null }
    } catch (error) {
      return { error: error.message }
    }
  }
  
  // Get current user from localStorage
  async function getCurrentUser() {
    try {
      loading.value = true
      
      // Check if we have a stored user
      const storedUser = localStorage.getItem('authUser')
      
      if (storedUser) {
        user.value = JSON.parse(storedUser)
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
  })
  
  return {
    user,
    loading,
    login,
    logout,
    getCurrentUser
  }
}
