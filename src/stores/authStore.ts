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

  return {
    token,
    user,
    isLoading,
    isAuthenticated,
    isAdmin,
    isEmployee,
    setAuth,
    clearAuth,
  }
})