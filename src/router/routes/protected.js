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
    path: '/dashboard/posts',
    name: 'dashboard-posts',
    component: () => import('../../views/admin/PostsView.vue'),
    meta: { 
      requiresAuth: true,
      layout: 'DashboardLayout'
    }
  },
  {
    path: '/dashboard/posts/new',
    name: 'create-post',
    component: () => import('../../views/admin/CreatePostView.vue'),
    meta: { 
      requiresAuth: true,
      layout: 'DashboardLayout'
    }
  },
  {
    path: '/dashboard/posts/edit/:id',
    name: 'edit-post',
    component: () => import('../../views/admin/CreatePostView.vue'),
    meta: { 
      requiresAuth: true,
      layout: 'DashboardLayout'
    }
  },
  {
    path: '/dashboard/projects',
    name: 'dashboard-projects',
    component: () => import('../../views/admin/ProjectsView.vue'),
    meta: { 
      requiresAuth: true,
      layout: 'DashboardLayout'
    }
  },
  {
    path: '/dashboard/projects/new',
    name: 'create-project',
    component: () => import('../../views/admin/CreateProjectView.vue'),
    meta: { 
      requiresAuth: true,
      layout: 'DashboardLayout'
    }
  },
  {
    path: '/dashboard/projects/edit/:id',
    name: 'edit-project',
    component: () => import('../../views/admin/CreateProjectView.vue'),
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
