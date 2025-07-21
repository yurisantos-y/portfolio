import { createRouter, createWebHistory } from 'vue-router'
import { authService } from '../services/auth'
import HomeView from '../views/HomeView.vue'
import { useSupabaseAuth } from '../composables/useSupabaseAuth'
import publicRoutes from './routes/public'
import authRoutes from './routes/auth'
import protectedRoutes from './routes/protected'

const routes = [
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

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const currentUser = await authService.getCurrentUser()
  
  if (requiresAuth && !currentUser) {
    next('/login')
  } else if (to.path === '/login' && currentUser) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router
