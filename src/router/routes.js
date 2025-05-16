import { authMiddleware } from './middleware/auth'

const routes = [
  {
    path: '/',
    component: () => import('layouts/LayoutBase.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/IndexPage.vue'),
        beforeEnter: authMiddleware,
      },
      {
        path: 'products',
        component: () => import('pages/products/ProductsPage.vue'),
        beforeEnter: authMiddleware,
      },
      {
        path: 'other',
        component: () => import('pages/CashBox.vue'),
        beforeEnter: authMiddleware,
      },
    ],
  },
  {
    path: '/login',
    component: () => import('layouts/LayoutBase.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/LoginPage.vue'),
      },
    ],
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
