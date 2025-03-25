export default [
  {
    path: '/about',
    name: 'about',
    component: () => import('../../views/AboutView.vue')
  },
  {
    path: '/blog',
    name: 'blog',
    component: () => import('../../views/BlogView.vue')
  },
  {
    path: '/projects',
    name: 'projects',
    component: () => import('../../views/ProjectsView.vue')
  },
  {
    path: '/thank',
    name: 'thank',
    component: () => import('../../views/ThankView.vue')
  }
]
