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
        // Use the userId from the login response directly and consistently
        const userIdFromLogin = response.data.refreshToken.userId

        localStorage.setItem('accessToken', accessToken)
        localStorage.setItem('refreshToken', refreshTokenString)
        localStorage.setItem('userData', JSON.stringify(userData))
        localStorage.setItem('userRole', JSON.stringify(userRole))
        localStorage.setItem('username', username)
        // Store it as 'userId' for consistency with getCurrentUser and authStore
        localStorage.setItem('userId', userIdFromLogin)

        // Optional: The block fetching from /api/User can be kept if it's for additional details,
        // but the primary userId for the session should be userIdFromLogin.
        // For now, we'll ensure sessionData uses userIdFromLogin.
        // If the /api/User call is purely to get the ID, it might be redundant if the login response is reliable.

        // *** Nueva lógica para obtener el ID del usuario (Consider if still needed for ID) ***
        // let fetchedUserDetails = null; // Example if you fetch more details
        // try {
        //   console.log('loginService: Buscando detalles adicionales del usuario...');
        //   const usersResponse = await userApi.apiUserGet();
        //   const users = usersResponse.data;
        //   if (Array.isArray(users)) {
        //     const loggedInUser = users.find((user) => user.username === username);
        //     if (loggedInUser) {
        //       fetchedUserDetails = loggedInUser;
        //       // If this call provides a more definitive or complete ID, you might reconsider,
        //       // but ensure it doesn't overwrite a valid userIdFromLogin with null.
        //       // For instance, if userIdFromLogin is always present, prefer that.
        //       // localStorage.setItem('userId', loggedInUser.id); // Potentially update if this is more accurate
        //       console.log('loginService: Detalles adicionales del usuario encontrados:', fetchedUserDetails);
        //     } else {
        //       console.warn('loginService: Usuario logueado no encontrado en la lista de /api/User para detalles adicionales.');
        //     }
        //   } else {
        //     console.warn('loginService: La respuesta de /api/User no es un array para detalles adicionales.');
        //   }
        // } catch (userError) {
        //   console.error('loginService: Error al obtener detalles adicionales de /api/User', userError);
        // }
        // *** Fin de nueva lógica ***

        const sessionData = {
          username,
          accessToken,
          refreshToken: refreshTokenString,
          userData,
          role: userRole,
          userId: userIdFromLogin, // Use the reliable ID from the login response
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
    localStorage.removeItem('userId') // Eliminar el ID del usuario
  },

  getCurrentUser() {
    try {
      const accessToken = localStorage.getItem('accessToken')
      const refreshToken = localStorage.getItem('refreshToken')
      const userDataString = localStorage.getItem('userData')
      const userRoleString = localStorage.getItem('userRole')
      const username = localStorage.getItem('username')
      const userId = localStorage.getItem('userId') // Correctly retrieves 'userId'

      if (accessToken && refreshToken && userDataString && userRoleString && username && userId) {
        const userData = JSON.parse(userDataString)
        const role = JSON.parse(userRoleString)
        return {
          username,
          accessToken,
          refreshToken,
          userData: {
            ...userData,
            id: userId,
          },
          role,
          userId, // This is from localStorage.getItem('userId')
        }
      }
      return null // Returns null if 'userId' from localStorage is missing
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
