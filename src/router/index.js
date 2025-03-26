import { createRouter, createWebHistory } from 'vue-router'
import { authService } from '../services/auth'
import HomeView from '../views/HomeView.vue'
import { useSupabaseAuth } from '../composables/useSupabaseAuth'
import publicRoutes from './routes/public'
import authRoutes from './routes/auth'
import protectedRoutes from './routes/protected'
import PostsView from '../views/admin/PostsView.vue'
import CreatePostView from '../views/admin/CreatePostView.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/login/LoginView.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/admin/DashboardView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/dashboard/posts',
    name: 'posts',
    component: PostsView,
    meta: { requiresAuth: true }
  },
  {
    path: '/dashboard/posts/new',
    name: 'create-post',
    component: CreatePostView,
    meta: { requiresAuth: true }
  },
  {
    path: '/dashboard/posts/edit/:id',
    name: 'edit-post',
    component: CreatePostView,
    meta: { requiresAuth: true }
  },
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
