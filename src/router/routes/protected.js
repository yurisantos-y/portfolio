export default [
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('../../views/admin/DashboardView.vue'),
    meta: { 
      requiresAuth: true,
      layout: 'DashboardLayout'
    }
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
