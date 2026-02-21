import { defineBoot } from '#q-app/wrappers'
import axios from 'axios'
// Asumo que podrías querer usar loginService para el logout, si es así, impórtalo.
// import { loginService } from 'src/services/auth/login' // Descomenta si lo usas

const api = axios.create({ baseURL: 'http://localhost:5183' })

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken') // Leer el accessToken directamente
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

api.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        const refreshTokenString = localStorage.getItem('refreshToken') // Leer el refreshToken directamente
        if (refreshTokenString) {
          // El payload para refrescar el token. Asegúrate que coincida con lo que espera tu backend.
          // Comúnmente es el token de refresco en sí.
          const refreshPayload = { token: refreshTokenString } // Usamos la instancia global de axios para la solicitud de refresh token
          // para evitar problemas con interceptores de la instancia 'api' si esta llamada también fallara.
          const refreshResponse = await axios.post(
            api.defaults.baseURL + '/Auth/refresh-token', // Usa la baseURL de la instancia 'api'
            refreshPayload,
            { headers: { 'Content-Type': 'application/json' } },
          )

          const newAccessToken = refreshResponse.data.accessToken
          localStorage.setItem('accessToken', newAccessToken) // Guardar el nuevo accessToken

          // Opcional: Si tu API devuelve un nuevo token de refresco, actualízalo también
          if (refreshResponse.data.refreshToken && refreshResponse.data.refreshToken.token) {
            localStorage.setItem('refreshToken', refreshResponse.data.refreshToken.token)
          } else if (typeof refreshResponse.data.refreshToken === 'string') {
            localStorage.setItem('refreshToken', refreshResponse.data.refreshToken)
          }

          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
          return api(originalRequest) // Reintentar la solicitud original con la instancia 'api'
        } else {
          console.error(
            'Token de refresco no encontrado en localStorage. El usuario necesita iniciar sesión de nuevo.',
          )
          // Aquí deberías manejar el logout, por ejemplo:
          // loginService.logout(); // Si importaste loginService
          // window.location.href = '/login'; // O redirigir manualmente
        }
      } catch (refreshError) {
        console.error('Error durante el refresco del token:', refreshError)
        if (refreshError.response && refreshError.response.status === 401) {
          console.error('El refresco del token falló con 401. Cerrando sesión del usuario.')
          // Aquí es crucial manejar el logout completo
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
          localStorage.removeItem('userData')
          localStorage.removeItem('userRole')
          localStorage.removeItem('username')
          localStorage.removeItem('id')
          // loginService.logout(); // Si importaste loginService
          // window.location.href = '/login'; // O redirigir manualmente
        }
        return Promise.reject(refreshError)
      }
    }
    return Promise.reject(error)
  },
)

export default defineBoot(({ app }) => {
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
})

export { api }
