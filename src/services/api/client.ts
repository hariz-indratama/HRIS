import axios from 'axios'
import type { AxiosInstance, AxiosError } from 'axios'
import { useAuthStore } from '@/stores/authStore'

const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost/api/v1',
  timeout: 10000,
  withCredentials: true, // Laravel Sanctum cookie-based auth
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      const authStore = useAuthStore()
      authStore.clearAuth()
      // SPA-safe redirect — avoids full page reload
      const router = (window as unknown as { __vueRouter?: { push: (path: string) => void } }).__vueRouter
      if (router) {
        router.push('/auth/login')
      } else {
        window.location.href = '/auth/login'
      }
    }
    return Promise.reject(error)
  },
)

export default apiClient
