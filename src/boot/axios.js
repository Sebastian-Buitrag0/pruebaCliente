import { defineBoot } from '#q-app/wrappers'
import axios from 'axios'

const api = axios.create({ baseURL: 'http://localhost:5183/api' })

// Interceptor de solicitudes (request)
api.interceptors.request.use(
  (config) => {
    // Puedes modificar la configuración, por ejemplo, agregar un token de autenticación
    // config.headers.Authorization = `Bearer ${token}`
    console.log('Request intercepted:', config)
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Interceptor de respuestas (response)
api.interceptors.response.use(
  (response) => {
    console.log('Response intercepted:', response)
    return response
  },
  (error) => {
    // Manejar errores globalmente
    // Por ejemplo, si error.response.status === 401, redirigir al login.
    return Promise.reject(error)
  },
)

export default defineBoot(({ app }) => {
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
})

export { api }
