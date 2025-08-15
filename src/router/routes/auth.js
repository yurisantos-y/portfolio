export default [
  {
    path: '/login',
    name: 'login',
    component: () => import('../../views/login/LoginView.vue'),
    // Redirect authenticated users away from login page
    meta: { redirectIfAuth: true }
  },
  {
    path: '/auth/callback',
    name: 'auth-callback',
    component: () => import('../../views/login/OAuthCallbackView.vue'),
    meta: { public: true }
  },
  {
    path: '/unauthorized',
    name: 'unauthorized',
    component: () => import('../../views/UnauthorizedView.vue')
  }
]
