import { useAuthStore } from 'src/stores/auth'

export function authMiddleware(to, from, next) {
  const authStore = useAuthStore()
  const publicPages = ['/login', '/register', '/forgot-password']
  const authRequired = !publicPages.includes(to.path)

  if (authRequired && !authStore.isAuthenticated) {
    return next({
      path: '/login',
      query: { redirect: to.fullPath },
    })
  }

  if (!authRequired && authStore.isAuthenticated) {
    return next('/')
  }

  next()
}
