export default [
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('../../views/DashboardView.vue'),
    meta: { 
      requiresAuth: true,
      layout: 'DashboardLayout'
    }
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('../../views/ProfileView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import('../../views/AdminView.vue'),
    meta: { 
      requiresAuth: true, 
      requiredRole: 'admin'
    }
  }
]
