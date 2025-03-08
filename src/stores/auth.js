import { defineStore } from 'pinia'
import { loginService } from 'src/services/auth/login'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
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
        const response = await loginService.login(credentials)
        this.user = response.user
        this.token = response.token
        return true
      } catch (error) {
        this.error = error.message || 'Error durante el inicio de sesión'
        return false
      } finally {
        this.loading = false
      }
    },

    logout() {
      loginService.logout()
      this.user = null
      this.token = null
      this.error = null
    },

    initializeFromStorage() {
      const user = loginService.getCurrentUser()
      if (user) {
        this.user = user
        this.token = user.token
      }
    },
  },
})
