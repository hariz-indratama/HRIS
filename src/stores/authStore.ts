import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@/types/models/User'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('auth_token'))
  const user = ref<User | null>(null)
  const isLoading = ref(false)

  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const isEmployee = computed(() => user.value?.role === 'employee')

  function setAuth(newToken: string, newUser: User): void {
    token.value = newToken
    user.value = newUser
    localStorage.setItem('auth_token', newToken)
  }

  function clearAuth(): void {
    token.value = null
    user.value = null
    localStorage.removeItem('auth_token')
  }

  async function fetchUser(): Promise<void> {
    if (!token.value) return
    isLoading.value = true
    try {
      const { userApi } = await import('@/services/api/userApi')
      const response = await userApi.getMe()
      if (response.success && response.data) {
        user.value = {
          id: response.data.id,
          name: response.data.name,
          email: response.data.email,
          role: response.data.role as 'admin' | 'employee',
          department: response.data.department ?? null,
          position: response.data.position ?? null,
          avatarUrl: response.data.avatarUrl ?? null,
          phone: response.data.phone ?? null,
        }
      }
    } catch {
      // Token invalid — clear session
      clearAuth()
    } finally {
      isLoading.value = false
    }
  }

  return {
    token,
    user,
    isLoading,
    isAuthenticated,
    isAdmin,
    isEmployee,
    setAuth,
    clearAuth,
    fetchUser,
  }
})