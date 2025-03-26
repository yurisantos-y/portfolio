export default [
  {
    path: '/login',
    name: 'login',
    component: () => import('../../views/login/LoginView.vue'),
    // Redirect authenticated users away from login page
    meta: { redirectIfAuth: true }
  },
  {
    path: '/unauthorized',
    name: 'unauthorized',
    component: () => import('../../views/UnauthorizedView.vue')
  }
]
