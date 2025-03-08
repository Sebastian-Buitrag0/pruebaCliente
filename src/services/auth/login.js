import { api } from 'src/boot/axios'

export const loginService = {
  async login(credentials) {
    try {
      const response = await api.post('Auth/login', credentials)
      if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data))
      }
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  logout() {
    localStorage.removeItem('user')
  },

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'))
  },

  isAuthenticated() {
    const user = this.getCurrentUser()
    return !!user && !!user.token
  },
}

export default loginService
