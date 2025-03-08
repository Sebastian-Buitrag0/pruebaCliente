const routes = [
  {
    path: '/',
    component: () => import('layouts/LayoutBase.vue'),
    children: [{ path: '', component: () => import('src/pages/auth/LoginPage.vue') }],
  },
  {
    path: '/products',
    component: () => import('layouts/LayoutOpc.vue'),
    children: [{ path: '', component: () => import('pages/products/ProductsPage.vue') }],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
