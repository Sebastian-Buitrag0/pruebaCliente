import { defineBoot } from '#q-app/wrappers'
import axios from 'axios'

const api = axios.create({ baseURL: 'http://localhost:5183/api' })

// Interceptor de solicitudes (request)
api.interceptors.request.use(
  (config) => {
    // Si el usuario está logueado, inyectamos el token de acceso
    const user = localStorage.getItem('user')
    if (user) {
      const token = JSON.parse(user).accessToken
      config.headers.Authorization = `Bearer ${token}`
    }
    console.log('Request intercepted:', config)
    return config
  },
  (error) => Promise.reject(error),
)

// Interceptor de respuestas (response)
api.interceptors.response.use(
  (response) => {
    console.log('Response intercepted:', response)
    return response
  },
  async (error) => {
    const originalRequest = error.config
    // Si el error es 401 y la petición no se ha reintentado
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        // Obtén el refreshToken del usuario almacenado (asegúrate de haberlo guardado)
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
          const user = JSON.parse(storedUser)
          if (user.token) {
            // Realiza la petición de refresco
            const refreshResponse = await axios.post(
              api.defaults.baseURL + '/Auth/refresh-token',
              { token: user.token },
              { headers: { 'Content-Type': 'application/json' } },
            )
            // Extrae el nuevo token
            const newAccessToken = refreshResponse.data.accessToken
            user.accessToken = newAccessToken
            localStorage.setItem('user', JSON.stringify(user))
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
            return axios(originalRequest)
          }
        }
      } catch (refreshError) {
        // Si falla el refresh, puedes redirigir al login o manejar el error según tu lógica
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
