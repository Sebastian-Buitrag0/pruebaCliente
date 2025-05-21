import { api as axiosInstance } from 'src/boot/axios.js'
import { AuthApi } from 'src/services/generated-api/api'

export const loginService = {
  async login(credentials) {
    const authApi = new AuthApi(undefined, undefined, axiosInstance)

    const userLoginRequest = {
      username: credentials.username,
      password: credentials.password,
    }

    try {
      console.log('loginService: Intentando iniciar sesión con:', userLoginRequest)
      const response = await authApi.apiAuthLoginPost(userLoginRequest)

      console.log(
        'loginService: Respuesta recibida de la API:',
        JSON.stringify(response.data, null, 2),
      )
      if (
        response.data &&
        response.data.accessToken &&
        response.data.refreshToken &&
        response.data.refreshToken.token &&
        response.data.refreshToken.user &&
        response.data.refreshToken.user.userData &&
        response.data.refreshToken.user.role &&
        response.data.refreshToken.user.username
      ) {
        console.log('loginService: Todos los datos necesarios están presentes en la respuesta.')
        const accessToken = response.data.accessToken
        const refreshTokenString = response.data.refreshToken.token
        const userData = response.data.refreshToken.user.userData
        const userRole = response.data.refreshToken.user.role
        const username = response.data.refreshToken.user.username

        localStorage.setItem('accessToken', accessToken)
        localStorage.setItem('refreshToken', refreshTokenString)
        localStorage.setItem('userData', JSON.stringify(userData))
        localStorage.setItem('userRole', JSON.stringify(userRole))
        localStorage.setItem('username', username)

        const sessionData = {
          username,
          accessToken,
          refreshToken: refreshTokenString,
          userData,
          role: userRole,
        }
        console.log('loginService: Devolviendo datos de sesión:', sessionData)
        return sessionData
      } else {
        console.error('loginService: Faltan datos esenciales en la respuesta de la API.') // Log para saber que entramos al else
        let missingDataError = 'Login exitoso pero faltan datos esenciales en la respuesta: '
        if (!response.data) missingDataError = 'response.data es nulo o indefinido. '
        else {
          if (!response.data.accessToken) missingDataError += 'accessToken, '
          if (!response.data.refreshToken) missingDataError += 'refreshToken object, '
          else if (!response.data.refreshToken.token)
            missingDataError += 'refreshToken.token (string), '
          if (!response.data.refreshToken || !response.data.refreshToken.user)
            missingDataError += 'refreshToken.user object, '
          else {
            if (!response.data.refreshToken.user.userData) missingDataError += 'userData, '
            if (!response.data.refreshToken.user.role) missingDataError += 'userRole, '
            if (!response.data.refreshToken.user.username) missingDataError += 'username, '
          }
        }
        throw new Error(missingDataError.slice(0, -2) + '.')
      }
    } catch (error) {
      let errorMessage = 'Error al iniciar sesión.'
      console.error('Error DENTRO de loginService.login (bloque catch):', error)
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
      console.error('loginService: Lanzando error con mensaje:', errorMessage)
      throw new Error(errorMessage)
    }
  },

  logout() {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('userData')
    localStorage.removeItem('userRole')
    localStorage.removeItem('username')
    localStorage.removeItem('user')
  },

  getCurrentUser() {
    try {
      const accessToken = localStorage.getItem('accessToken')
      const refreshToken = localStorage.getItem('refreshToken')
      const userDataString = localStorage.getItem('userData')
      const userRoleString = localStorage.getItem('userRole')
      const username = localStorage.getItem('username')

      if (accessToken && refreshToken && userDataString && userRoleString && username) {
        const userData = JSON.parse(userDataString)
        const role = JSON.parse(userRoleString)
        return {
          username,
          accessToken,
          refreshToken,
          userData,
          role,
        }
      }
      return null
    } catch (e) {
      console.error('Error al parsear datos del usuario desde localStorage', e)
      this.logout()
      return null
    }
  },

  isAuthenticated() {
    const accessToken = localStorage.getItem('accessToken')
    return !!accessToken
  },
}

export default loginService
