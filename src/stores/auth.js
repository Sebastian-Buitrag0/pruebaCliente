import { defineStore } from 'pinia'
import { loginService } from 'src/services/auth/login'
// import { router } from 'src/router'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    username: null,
    userId: null,
    token: null,
    loading: false,
    error: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    currentUser: (state) => state.user,
    getCurrentUserId: (state) => state.userId,
    hasError: (state) => !!state.error,
  },

  actions: {
    async login(credentials) {
      this.loading = true
      this.error = null
      try {
        const session = await loginService.login(credentials) // Asegúrate de que 'await' esté aquí

        if (session) {
          this.user = session.username
          this.userId = session.userId
          this.token = session.accessToken
          console.log('Store updated after login:', {
            user: this.user,
            userId: this.userId,
            token: this.token,
          })
          return true // Éxito
        } else {
          throw new Error('loginService no devolvió una sesión válida.')
        }
      } catch (error) {
        console.error('Error en authStore.login:', error)
        this.error = error.message || 'Error durante el inicio de sesión en el store'
        this.user = null
        this.userId = null
        this.token = null
        return false // Fallo
      } finally {
        this.loading = false
      }
    },

    logout() {
      loginService.logout()
      this.user = null
      this.userId = null
      this.token = null
      this.error = null
      // router.push('/login')
    },

    initializeFromStorage() {
      const userSession = loginService.getCurrentUser()
      if (userSession && userSession.accessToken) {
        this.user = userSession.username
        this.userId = userSession.userId
        this.token = userSession.accessToken
        console.log('Store initialized from storage:', {
          user: this.user,
          userId: this.userId,
          token: this.token,
        })
      } else {
        this.user = null
        this.userId = null
        this.token = null
      }
    },
  },
})
