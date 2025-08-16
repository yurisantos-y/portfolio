import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import publicRoutes from './routes/public'
import authRoutes from './routes/auth'
import protectedRoutes from './routes/protected'

// Lazy load auth service to prevent circular dependencies
let authService = null;

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
  try {
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    
    if (requiresAuth) {
      // Lazy load auth service when needed
      if (!authService) {
        const { authService: loadedAuthService } = await import('../services/auth');
        authService = loadedAuthService;
      }
      
      const currentUser = await authService.getCurrentUser();
      
      if (!currentUser) {
        next('/login');
        return;
      }
    } else if (to.path === '/login') {
      // Lazy load auth service for login redirect check
      if (!authService) {
        const { authService: loadedAuthService } = await import('../services/auth');
        authService = loadedAuthService;
      }
      
      const currentUser = await authService.getCurrentUser();
      if (currentUser) {
        next('/dashboard');
        return;
      }
    }
    
    next();
  } catch (error) {
    console.error('Router navigation error:', error);
    next();
  }
})

export default router
