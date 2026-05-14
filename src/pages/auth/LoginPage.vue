<template>
  <div class="w-full max-w-sm">
    <div class="bg-card rounded-lg border border-border p-8 shadow-sm">
      <div class="text-center mb-8">
        <h1 class="text-2xl font-bold text-foreground">HRIS</h1>
        <p class="text-sm text-muted-foreground mt-1">Sign in to your account</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div class="space-y-2">
          <label for="email" class="text-sm font-medium text-foreground">Email</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            placeholder="you@example.com"
            class="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            :class="{ 'border-destructive': errors.email }"
            autocomplete="email"
          />
          <p v-if="errors.email" class="text-xs text-destructive">{{ errors.email }}</p>
        </div>

        <div class="space-y-2">
          <label for="password" class="text-sm font-medium text-foreground">Password</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            placeholder="••••••••"
            class="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            :class="{ 'border-destructive': errors.password }"
            autocomplete="current-password"
          />
          <p v-if="errors.password" class="text-xs text-destructive">{{ errors.password }}</p>
        </div>

        <p v-if="submitError" class="text-sm text-destructive text-center">{{ submitError }}</p>

        <button
          type="submit"
          :disabled="isSubmitting"
          class="w-full py-2.5 px-4 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {{ isSubmitting ? 'Signing in...' : 'Sign in' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { authApi } from '@/services/api/authApi'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive({
  email: '',
  password: '',
})

const errors = reactive({
  email: '',
  password: '',
})

const isSubmitting = ref(false)
const submitError = ref('')

function validateForm(): boolean {
  let valid = true
  errors.email = ''
  errors.password = ''

  if (!form.email) {
    errors.email = 'Email is required.'
    valid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Please enter a valid email address.'
    valid = false
  }

  if (!form.password) {
    errors.password = 'Password is required.'
    valid = false
  } else if (form.password.length < 8) {
    errors.password = 'Password must be at least 8 characters.'
    valid = false
  }

  return valid
}

async function handleLogin(): Promise<void> {
  submitError.value = ''
  if (!validateForm()) return

  isSubmitting.value = true
  try {
    const response = await authApi.login(form.email, form.password)
    if (response.success) {
      authStore.setAuth(response.token, response.user)
      const redirect = authStore.isAdmin ? '/admin' : '/'
      router.push(redirect)
    } else {
      submitError.value = response.message ?? 'Login failed. Please try again.'
    }
  } catch (err: unknown) {
    const error = err as { response?: { data?: { message?: string } } }
    submitError.value =
      error.response?.data?.message ?? 'An unexpected error occurred. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}
</script>
