import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useSupabaseAuth } from '../composables/useSupabaseAuth'
import publicRoutes from './routes/public'
import authRoutes from './routes/auth'
import protectedRoutes from './routes/protected'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    // Group routes logically
    ...publicRoutes,
    ...authRoutes,
    ...protectedRoutes
  ]
})

// Improved navigation guard with better error handling
router.beforeEach(async (to, from, next) => {
  try {
    // Check if route requires authentication
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
    
    if (!requiresAuth) {
      return next()
    }
    
    // Get current user and verify authentication
    const { getCurrentUser } = useSupabaseAuth()
    const { user, error } = await getCurrentUser()
    
    if (error) {
      console.error("Authentication error:", error.message)
      return next({ path: '/login', query: { redirect: to.fullPath } })
    }
    
    if (!user) {
      // Redirect to login if user is not authenticated
      return next({ path: '/login', query: { redirect: to.fullPath } })
    }
    
    // Check for additional role-based permissions if specified
    if (to.meta.requiredRole && user.role !== to.meta.requiredRole) {
      return next({ path: '/unauthorized' })
    }
    
    next()
  } catch (error) {
    console.error("Navigation guard error:", error.message || error)
    next({ path: '/login' })
  }
})

export default router
