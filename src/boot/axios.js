import { defineBoot } from '#q-app/wrappers'
import axios from 'axios'

const api = axios.create({ baseURL: 'http://localhost:5183' })

api.interceptors.request.use(
  (config) => {
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

api.interceptors.response.use(
  (response) => {
    console.log('Response intercepted:', response)
    return response
  },
  async (error) => {
    const originalRequest = error.config
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
          const user = JSON.parse(storedUser)
          if (user.token) {
            const refreshResponse = await axios.post(
              api.defaults.baseURL + '/Auth/refresh-token',
              { token: user.token },
              { headers: { 'Content-Type': 'application/json' } },
            )
            const newAccessToken = refreshResponse.data.accessToken
            user.accessToken = newAccessToken
            localStorage.setItem('user', JSON.stringify(user))
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
            return axios(originalRequest)
          }
        }
      } catch (refreshError) {
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
