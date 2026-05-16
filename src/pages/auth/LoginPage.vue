<template>
  <div class="w-full max-w-sm">
    <div class="bg-card rounded-lg border border-border p-8 shadow-sm">
      <div class="text-center mb-8">
        <h1 class="text-2xl font-bold text-foreground">
          HRIS
        </h1>
        <p class="text-sm text-muted-foreground mt-1">
          Sign in to your account
        </p>
      </div>

      <form
        class="space-y-4"
        @submit.prevent="handleLogin"
      >
        <div class="space-y-2">
          <label
            for="email"
            class="text-sm font-medium text-foreground"
          >Email</label>
          <Input
            id="email"
            v-model="email"
            type="email"
            placeholder="you@example.com"
            :class="{ 'border-destructive': errors.email }"
            autocomplete="email"
          />
          <p
            v-if="errors.email"
            class="text-xs text-destructive"
          >
            {{ errors.email }}
          </p>
        </div>

        <div class="space-y-2">
          <label
            for="password"
            class="text-sm font-medium text-foreground"
          >Password</label>
          <Input
            id="password"
            v-model="password"
            type="password"
            placeholder="••••••••"
            :class="{ 'border-destructive': errors.password }"
            autocomplete="current-password"
          />
          <p
            v-if="errors.password"
            class="text-xs text-destructive"
          >
            {{ errors.password }}
          </p>
        </div>

        <p
          v-if="submitError"
          class="text-sm text-destructive text-center"
        >
          {{ submitError }}
        </p>

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
import { useAuth } from '@/composables/useAuth'
import { Input } from '@/components/ui/input'

const router = useRouter()
const { login, isAdmin } = useAuth()

const email = ref('')
const password = ref('')

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

  if (!email.value) {
    errors.email = 'Email is required.'
    valid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    errors.email = 'Please enter a valid email address.'
    valid = false
  }

  if (!password.value) {
    errors.password = 'Password is required.'
    valid = false
  } else if (password.value.length < 8) {
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
    const result = await login(email.value, password.value)
    if (result.success) {
      const redirect = isAdmin.value ? '/admin' : '/'
      router.push(redirect)
    } else {
      submitError.value = result.message ?? 'Login failed. Please try again.'
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
