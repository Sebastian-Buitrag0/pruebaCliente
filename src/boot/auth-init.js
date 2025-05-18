import { defineBoot } from '#q-app/wrappers'
import { useAuthStore } from 'src/stores/auth'

export default defineBoot(() => {
  const authStore = useAuthStore()
  authStore.initializeFromStorage()
})
