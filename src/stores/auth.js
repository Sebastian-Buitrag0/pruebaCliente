import { defineStore } from 'pinia'
import { loginService } from 'src/services/auth/login'
// import { router } from 'src/router'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    username: null,
    token: null,
    loading: false,
    error: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    currentUser: (state) => state.user,
    hasError: (state) => !!state.error,
  },

  actions: {
    async login(credentials) {
      this.loading = true
      this.error = null
      try {
        const userSession = await loginService.login(credentials)

        if (userSession && userSession.token) {
          this.user = { username: userSession.username }
          this.token = userSession.token
          console.log('Store updated after login:', { user: this.user, token: this.token })
          return true // Éxito
        } else {
          throw new Error('loginService no devolvió una sesión válida.')
        }
      } catch (error) {
        console.error('Error en authStore.login:', error)
        this.error = error.message || 'Error durante el inicio de sesión en el store'
        this.user = null
        this.token = null
        return false // Fallo
      } finally {
        this.loading = false
      }
    },

    logout() {
      loginService.logout()
      this.user = null
      this.token = null
      this.error = null
      // router.push('/login')
    },

    initializeFromStorage() {
      const userSession = loginService.getCurrentUser()
      if (userSession && userSession.token) {
        this.user = { username: userSession.username }
        this.token = userSession.token
        // this.refreshToken = userSession.refreshToken;
      } else {
        this.user = null
        this.token = null
      }
    },
  },
})
