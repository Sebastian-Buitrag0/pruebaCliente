import { api as axiosInstance } from 'src/boot/axios.js'
// Asegúrate que la ruta a tu api.ts generado sea correcta
import { AuthApi } from 'src/services/generated-api/api'

export const loginService = {
  async login(credentials) {
    const authApi = new AuthApi(undefined, undefined, axiosInstance)

    const userLoginRequest = {
      username: credentials.username,
      password: credentials.password,
    }

    try {
      console.log('userLoginRequest:', userLoginRequest)
      const response = await authApi.apiAuthLoginPost(userLoginRequest)

      if (response.data && response.data.accessToken) {
        const userSession = {
          username: credentials.username, // O de response.data si la API lo incluyera
          token: response.data.accessToken, // Usar accessToken
          refreshToken: response.data.refreshToken,
        }
        localStorage.setItem('user', JSON.stringify(userSession))
        return userSession // <-- DEVUELVE LA SESIÓN DEL USUARIO
      } else {
        throw new Error('Login exitoso pero no se recibió el token de acceso.')
      }
    } catch (error) {
      let errorMessage = 'Error al iniciar sesión.'
      if (error.response) {
        errorMessage =
          error.response.data?.message ||
          error.response.data?.title ||
          error.response.statusText ||
          errorMessage
      } else if (error.request) {
        errorMessage = 'No se pudo conectar con el servidor. Verifica tu conexión.'
      } else {
        errorMessage = error.message || errorMessage
      }
      console.error('Error en loginService.login:', error)
      throw new Error(errorMessage)
    }
  },

  logout() {
    localStorage.removeItem('user')
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('user')
    try {
      return userStr ? JSON.parse(userStr) : null
    } catch (e) {
      console.error('Error al parsear el usuario desde localStorage', e)
      localStorage.removeItem('user')
      return null
    }
  },

  isAuthenticated() {
    const user = this.getCurrentUser()
    return !!user && !!user.token // 'token' es como lo guardamos en userSession
  },
}

export default loginService
