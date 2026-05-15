/**
 * useAuth.ts
 *
 * Composable for authentication-related state and actions.
 * Provides reactive computed properties for auth state and wraps authApi calls
 * with store integration.
 *
 * @packageDocumentation
 */

import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { authApi } from '@/services/api/authApi'

export function useAuth() {
  const authStore = useAuthStore()
  const router = useRouter()

  // ─── Computed ────────────────────────────────────────────────────────────────

  const isAuthenticated = computed(() => authStore.isAuthenticated)
  const isAdmin = computed(() => authStore.isAdmin)
  const isEmployee = computed(() => authStore.isEmployee)
  const user = computed(() => authStore.user)

  // ─── Actions ─────────────────────────────────────────────────────────────────

  /**
   * Attempts to log in with email and password.
   *
   * @param email - The user's email address.
   * @param password - The user's password.
   * @returns An object with a `success` boolean and an optional `message`.
   */
  async function login(
    email: string,
    password: string,
  ): Promise<{ success: boolean; message?: string }> {
    authStore.isLoading = true
    try {
      const response = await authApi.login({ email, password })
      if (response.success) {
        // Sanctum stateful: token in session cookie, user from response
        authStore.setAuth('', response.data.user)
        return { success: true }
      }
      return { success: false, message: response.message || 'Login failed' }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed'
      return { success: false, message }
    } finally {
      authStore.isLoading = false
    }
  }

  /**
   * Logs the current user out — calls the API then clears local auth state.
   * Redirects to `/auth/login` regardless of API outcome.
   */
  async function logout(): Promise<void> {
    try {
      await authApi.logout()
    } catch {
      // Ignore logout API errors — always clear local state
    } finally {
      authStore.clearAuth()
      router.push('/auth/login')
    }
  }

  return {
    isAuthenticated,
    isAdmin,
    isEmployee,
    user,
    login,
    logout,
  }
}