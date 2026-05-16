# Frontend Architecture Refactoring — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Comprehensive 4-phase refactoring of the HRIS V2 frontend — eliminating 18 findings (6 CRITICAL, 7 WARNING, 5 OPTIMIZATION) across design tokens, component architecture, PWA UX, and state management.

**Architecture:** Single `refactor/frontend-architecture` branch. Phase-per-commit strategy. Shadcn-only token system (remove Stitch). Cookie-based Sanctum auth (remove misleading Bearer interceptor). Shadcn Sonner for toast. Per-task TDD with Vitest unit tests + Playwright E2E tests.

**Tech Stack:** Vue 3 (Composition API, `<script setup lang="ts">`), Pinia, Tailwind CSS + Shadcn, Axios, Vitest, Playwright

---

## File Map

### Files Deleted
- `src/components/HelloWorld.vue`
- `src/style.css` (replaced with minimal `@tailwind base; @tailwind components; @tailwind utilities;` + Shadcn CSS variables)

### Files Created

| Path | Purpose |
|---|---|
| `src/components/pwa/ClockHeroCard.vue` | Clock + date display hero |
| `src/components/pwa/MonthlySummary.vue` | Monthly attendance summary |
| `src/components/pwa/GeofenceBadge.vue` | Geofence status indicator |
| `src/components/pwa/ClockInOutCta.vue` | Clock-in/out action button |
| `src/components/pwa/BiometricScanner.vue` | Biometric verification UI |
| `src/components/pwa/VerificationResult.vue` | Post-verification result display |
| `src/components/pwa/RecentActivity.vue` | Recent activity list |
| `src/composables/useDateFormat.ts` | formatDate, formatTime, formatDateTime |
| `src/composables/useToast.ts` | `useToast()` wrapper around Sonner |
| `src/lib/utils.ts` (extend) | `extractApiError(err: unknown): string` |
| `src/components/ui/sonner/Sonner.vue` | Shadcn Sonner Toaster component |
| `src/components/ui/sonner/index.ts` | Sonner barrel export |
| `src/__tests__/composables/useStatusStyles.test.ts` | Unit tests for status styles |
| `src/__tests__/composables/useAuth.test.ts` | Unit tests for useAuth |
| `src/__tests__/composables/useAttendance.test.ts` | Unit tests for useAttendance |
| `src/__tests__/lib/utils.test.ts` | Unit tests for extractApiError |
| `src/__tests__/composables/useDateFormat.test.ts` | Unit tests for useDateFormat |
| `e2e/auth.spec.ts` | Playwright: login success/failure/redirect |
| `e2e/attendance.spec.ts` | Playwright: clock-in/out/geofence error |
| `e2e/pwa-navigation.spec.ts` | Playwright: PWA nav flow |

### Files Modified

| Path | Changes |
|---|---|
| `src/style.css` | Replace with minimal Shadcn CSS vars only |
| `src/tailwind.config.js` | Remove Stitch palette, add `withCredentials: true` note |
| `src/composables/useStatusStyles.ts` | Replace literal colors with Shadcn semantic tokens |
| `src/services/api/client.ts` | Remove Bearer interceptor; add `withCredentials: true`; use Vue Router for 401 redirect |
| `src/stores/authStore.ts` | Keep `setAuth` but document cookie-only auth; no token needed |
| `src/pages/auth/LoginPage.vue` | Replace raw `authApi.login()` + `authStore.setAuth` with `useAuth().login()` |
| `src/layouts/AppPwaLayout.vue` | Fix touch targets, replace `:style` with Tailwind arbitrary utilities, hide back button on home |
| `src/pages/employee/HistoryPage.vue` | Replace `<p>Loading...</p>` with `<SkeletonCard>`, use `useDateFormat` |
| `src/pages/employee/pwa/AttPwaHomePage.vue` | Decompose into PWA components; wire `useAttendance`; replace `alert()` with toast |
| `src/pages/employee/pwa/AttPwaAbsenPage.vue` | Decompose into PWA components; replace `bg-white` with `bg-card` |
| `src/pages/employee/pwa/AttPwaRiwayatPage.vue` | Replace `bg-white` with `bg-card`; replace `bg-amber-400` with `bg-warning`; use `useDateFormat` |
| `src/pages/employee/pwa/AttPwaProfilPage.vue` | Replace `bg-white` with `bg-card` |
| `src/pages/employee/DashboardPage.vue` | Scan for any Stitch token usage → replace |
| `src/composables/useAttendance.ts` | Export `getDeviceId()` so it can be used by decomposed components |

---

## Phase 1 — Critical Debt Elimination

### Task 1: Delete Scaffold Boilerplate

**Files:**
- Delete: `src/components/HelloWorld.vue`
- Modify: `src/style.css`

- [ ] **Step 1: Delete HelloWorld.vue**

Command:
```bash
rm src/components/HelloWorld.vue
```
```bash
git add src/components/HelloWorld.vue
git commit -m "phase 1: remove HelloWorld.vue scaffold"
```

- [ ] **Step 2: Replace style.css with minimal Shadcn CSS vars**

Overwrite `src/style.css` with:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --success: 142 76% 36%;
    --success-foreground: 210 40% 98%;
    --warning: 38 92% 50%;
    --warning-foreground: 222.2 47.4% 11.2%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
    --radius: 0.5rem;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
    font-feature-settings: "rlig" 1, "calt" 1;
  }
}
```

```bash
git add src/style.css
git commit -m "phase 1: replace style.css with minimal Shadcn CSS vars"
```

---

### Task 2: Unify Design Token System — Migrate Stitch to Shadcn

**Files:**
- Modify: `src/tailwind.config.js`
- Modify: `src/composables/useStatusStyles.ts`
- Modify: `src/layouts/AppPwaLayout.vue`
- Modify: `src/pages/employee/pwa/AttPwaHomePage.vue`
- Modify: `src/pages/employee/pwa/AttPwaAbsenPage.vue`
- Modify: `src/pages/employee/pwa/AttPwaRiwayatPage.vue`
- Modify: `src/pages/employee/pwa/AttPwaProfilPage.vue`
- Scan: All other `.vue` files for `stitch-*` usage

- [ ] **Step 1: Replace useStatusStyles literal colors with Shadcn tokens**

Find in `src/composables/useStatusStyles.ts`:
```ts
bg: 'bg-green-50',
text: 'text-green-700',
border: 'border-green-200',
```

Replace with:
```ts
bg: 'bg-success/10',
text: 'text-success',
border: 'border-success/20',
```

Find:
```ts
bg: 'bg-amber-50',
text: 'text-amber-700',
border: 'border-amber-200',
```

Replace with:
```ts
bg: 'bg-warning/10',
text: 'text-warning',
border: 'border-warning/20',
```

Also update `error` and `neutral` groups — replace Stitch tokens with Shadcn equivalents:
```ts
error: {
  bg: 'bg-destructive/10',
  text: 'text-destructive',
  border: 'border-destructive/20',
},
neutral: {
  bg: 'bg-muted',
  text: 'text-muted-foreground',
  border: 'border-border',
},
```

```bash
git add src/composables/useStatusStyles.ts
git commit -m "phase 1: fix useStatusStyles — use Shadcn semantic tokens"
```

- [ ] **Step 2: Remove Stitch palette from tailwind.config.js**

Delete the entire Stitch block (lines 45–108 — `stitch-primary` through `stitch-muted` and `status.*` tokens). Keep only the Shadcn HSL tokens at the top. The `status.*` tokens are dead config — remove them entirely.

Resulting `tailwind.config.js`:
```js
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        success: {
          DEFAULT: 'hsl(var(--success))',
          foreground: 'hsl(var(--success-foreground))',
        },
        warning: {
          DEFAULT: 'hsl(var(--warning))',
          foreground: 'hsl(var(--warning-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        xl: '0.75rem',
        '2xl': '1rem',
        'pill': '9999px',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
```

```bash
git add src/tailwind.config.js
git commit -m "phase 1: remove Stitch palette from tailwind.config.js"
```

- [ ] **Step 3: Replace Stitch tokens in AppPwaLayout.vue**

In `src/layouts/AppPwaLayout.vue`:

Find `class="flex flex-col h-screen bg-stitch-surface overflow-hidden"` → replace with `class="flex flex-col h-screen bg-background overflow-hidden"`

Find `:style="{ paddingTop: 'env(safe-area-inset-top)' }"` → remove the `:style` binding and add `pt-[env(safe-area-inset-top)]` to the existing class string.

Find `:style="{ paddingBottom: 'calc(6rem + env(safe-area-inset-bottom))' }"` → remove the `:style` binding and add `pb-[calc(6rem+env(safe-area-inset-bottom))]` to the main element's class string.

Find all `border-stitch-outline-variant` → `border-border`
Find all `bg-stitch-surface-container` → `bg-muted`
Find all `bg-stitch-surface-container-high` → `bg-muted/50`
Find all `bg-white` → `bg-card`
Find all `text-stitch-primary` → `text-foreground`
Find all `text-stitch-on-surface-variant` → `text-muted-foreground`
Find all `bg-stitch-primary-container` → `bg-primary/10`
Find all `text-stitch-on-primary-container` → `text-primary`
Find all `shadow-sm` (on header/nav) → keep

- [ ] **Step 4: Replace Stitch tokens in AttPwaHomePage.vue**

Find all `bg-stitch-*` → `bg-card` (for white card backgrounds) or `bg-muted`/`bg-primary/10`
Find all `text-stitch-primary` → `text-foreground`
Find all `text-stitch-secondary` → `text-muted-foreground`
Find all `border-stitch-outline-variant` → `border-border`
Find all `bg-white` → `bg-card`
Find all `shadow-sm` → keep

```bash
git add src/layouts/AppPwaLayout.vue src/pages/employee/pwa/AttPwaHomePage.vue
git commit -m "phase 1: migrate AppPwaLayout + AttPwaHomePage Stitch→Shadcn tokens"
```

- [ ] **Step 5: Replace Stitch tokens in remaining PWA pages**

AttPwaAbsenPage.vue: Replace all Stitch tokens (find by grep for `stitch-`).
AttPwaRiwayatPage.vue: Replace all Stitch tokens AND `bg-amber-400` → `bg-warning`.
AttPwaProfilPage.vue: Replace all Stitch tokens AND `bg-white` → `bg-card`.

```bash
git add src/pages/employee/pwa/AttPwaAbsenPage.vue src/pages/employee/pwa/AttPwaRiwayatPage.vue src/pages/employee/pwa/AttPwaProfilPage.vue
git commit -m "phase 1: migrate remaining PWA pages Stitch→Shadcn tokens"
```

- [ ] **Step 6: Scan for remaining Stitch references**

Run:
```bash
grep -rn "stitch-" src/
```
Replace any remaining Stitch classes in any file with their Shadcn equivalents.

```bash
git add [any modified files]
git commit -m "phase 1: remove remaining stitch- references"
```

---

### Task 3: Fix Auth Flow

**Files:**
- Modify: `src/services/api/client.ts`
- Modify: `src/stores/authStore.ts`
- Modify: `src/pages/auth/LoginPage.vue`

- [ ] **Step 1: Fix client.ts — remove Bearer interceptor, add cookie auth, fix 401 redirect**

Read the current `src/services/api/client.ts` first, then replace the entire content with:

```ts
import axios from 'axios'
import type { AxiosInstance, AxiosError } from 'axios'
import { createRouter } from 'vue-router'

const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost/api/v1',
  timeout: 10000,
  withCredentials: true, // ← Laravel Sanctum cookie-based auth
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
      // Use Vue Router for SPA-safe 401 redirect
      const router = createRouter()
      router.push('/auth/login')
    }
    return Promise.reject(error)
  },
)

export default apiClient
```

> **NOTE:** The `createRouter()` call inside the interceptor creates a new router instance per call — this is a workaround since the interceptor module can't directly import the router (avoid circular dependency). In production, consider extracting the router instance at module load time via a lazy getter.

```bash
git add src/services/api/client.ts
git commit -m "phase 1: fix client.ts — cookie auth + SPA-safe 401 redirect"
```

- [ ] **Step 2: Update authStore to document cookie-only auth**

In `src/stores/authStore.ts`, find `localStorage.getItem('auth_token')` → the token from `localStorage` is NOT used for Bearer injection (interceptor removed). It may still be used as a session flag. Document this.

Add a comment above `setAuth`:
```ts
/**
 * Sets authenticated user state.
 * Note: This app uses Laravel Sanctum cookie-based auth (stateful).
 * The token parameter is stored as a session flag in localStorage only —
 * it is NOT sent as a Bearer token. Sanctum manages the session cookie server-side.
 */
function setAuth(newToken: string, newUser: User): void {
```

- [ ] **Step 3: Wire useAuth composable into LoginPage.vue**

In `src/pages/auth/LoginPage.vue`:

Remove the direct imports of `authApi` and `authStore`:
```ts
// REMOVE:
// import { useAuthStore } from '@/stores/authStore'
// import { authApi } from '@/services/api/authApi'
```

Add the composable import:
```ts
import { useAuth } from '@/composables/useAuth'
```

Replace the `handleLogin` function body. The current code (lines 123–147) calls `authApi.login()` directly and `authStore.setAuth()`. Replace with:

```ts
const { login } = useAuth()

async function handleLogin(): Promise<void> {
  submitError.value = ''
  if (!validateForm()) return

  isSubmitting.value = true
  try {
    const result = await login(email.value, password.value)
    if (result.success) {
      const redirect = authStore.isAdmin ? '/admin' : '/'
      router.push(redirect)
    } else {
      submitError.value = result.message ?? 'Login failed. Please try again.'
    }
  } catch (err: unknown) {
    submitError.value = extractApiError(err)
  } finally {
    isSubmitting.value = false
  }
}
```

Remove the `authStore` variable declaration (it's still needed for `authStore.isAdmin` in the redirect, but now imported via `useAuth()` computed). Keep `const authStore = useAuthStore()` only if the page still needs direct store access — otherwise `useAuth` already exposes `isAdmin`.

```bash
git add src/pages/auth/LoginPage.vue
git commit -m "phase 1: wire useAuth composable into LoginPage"
```

---

### Task 4: Write Unit Tests for useStatusStyles

**Files:**
- Create: `src/__tests__/composables/useStatusStyles.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// src/__tests__/composables/useStatusStyles.test.ts
import { describe, it, expect } from 'vitest'
import { useStatusStyles } from '@/composables/useStatusStyles'

describe('useStatusStyles', () => {
  it('success: returns Shadcn semantic classes (no literal colors)', () => {
    const { success } = useStatusStyles()
    expect(success.bg).toBe('bg-success/10')
    expect(success.text).toBe('text-success')
    expect(success.border).toBe('border-success/20')
  })

  it('error: returns Shadcn semantic classes', () => {
    const { error } = useStatusStyles()
    expect(error.bg).toBe('bg-destructive/10')
    expect(error.text).toBe('text-destructive')
    expect(error.border).toBe('border-destructive/20')
  })

  it('warning: returns Shadcn semantic classes (no literal colors)', () => {
    const { warning } = useStatusStyles()
    expect(warning.bg).toBe('bg-warning/10')
    expect(warning.text).toBe('text-warning')
    expect(warning.border).toBe('border-warning/20')
  })

  it('neutral: returns Shadcn semantic classes', () => {
    const { neutral } = useStatusStyles()
    expect(neutral.bg).toBe('bg-muted')
    expect(neutral.text).toBe('text-muted-foreground')
    expect(neutral.border).toBe('border-border')
  })

  it('no status group uses literal Tailwind colors (bg-green-50, bg-amber-50)', () => {
    const styles = useStatusStyles()
    const allClasses = Object.values(styles).flatMap((s) => [s.bg, s.text, s.border])
    const forbidden = ['bg-green-50', 'bg-amber-50', 'text-green-700', 'text-amber-700']
    forbidden.forEach((cls) => {
      expect(allClasses).not.toContain(cls)
    })
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run:
```
npx vitest run src/__tests__/composables/useStatusStyles.test.ts
```
Expected: **FAIL** — `bg-green-50` and `bg-amber-50` still in source.

- [ ] **Step 3: Fix useStatusStyles source code**

(Already done in Task 2, Step 1 — verify the file has been updated.)

- [ ] **Step 4: Run test to verify it passes**

Run:
```
npx vitest run src/__tests__/composables/useStatusStyles.test.ts
```
Expected: **PASS**

```bash
git add src/__tests__/composables/useStatusStyles.test.ts
git commit -m "phase 1: add useStatusStyles unit tests"
```

---

## Phase 2 — Component Decomposition

### Task 5: Extract PWA Components

**Files:**
- Create: `src/components/pwa/ClockHeroCard.vue`
- Create: `src/components/pwa/MonthlySummary.vue`
- Create: `src/components/pwa/GeofenceBadge.vue`
- Create: `src/components/pwa/ClockInOutCta.vue`
- Create: `src/components/pwa/BiometricScanner.vue`
- Create: `src/components/pwa/VerificationResult.vue`
- Create: `src/components/pwa/RecentActivity.vue`
- Modify: `src/pages/employee/pwa/AttPwaHomePage.vue`
- Modify: `src/pages/employee/pwa/AttPwaAbsenPage.vue`

- [ ] **Step 1: Create src/components/pwa/ directory**

```bash
mkdir -p src/components/pwa
```

- [ ] **Step 2: Create ClockHeroCard.vue**

```vue
<script setup lang="ts">
import { MapPin } from 'lucide-vue-next'
import { useStatusStyles } from '@/composables/useStatusStyles'

defineProps<{
  time: string
  date: string
  withinRange: boolean
}>()

const statusStyles = useStatusStyles()
</script>

<template>
  <section class="bg-card rounded-xl p-4 shadow-sm border border-border mb-4 text-center flex flex-col items-center">
    <div class="mb-3">
      <p class="text-[48px] font-bold tracking-tight text-foreground leading-none">
        {{ time }}
      </p>
      <p class="text-sm text-muted-foreground mt-1">
        {{ date }}
      </p>
    </div>

    <span
      class="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full"
      :class="[statusStyles.success.bg, statusStyles.success.border].join(' ')"
    >
      <MapPin class="w-3.5 h-3.5" :class="statusStyles.success.text" />
      <span class="text-xs font-semibold" :class="statusStyles.success.text">
        {{ withinRange ? 'Dalam Jangkauan' : 'Di Luar Jangkauan' }}
      </span>
    </span>

    <div class="mt-4 w-full h-28 rounded-lg overflow-hidden bg-muted relative">
      <div class="absolute inset-0 flex items-center justify-center">
        <div class="h-8 w-8 bg-primary rounded-full flex items-center justify-center border-4 border-card shadow-lg">
          <MapPin class="w-3.5 h-3.5 text-primary-foreground" />
        </div>
      </div>
    </div>
  </section>
</template>
```

- [ ] **Step 3: Create MonthlySummary.vue**

```vue
<script setup lang="ts">
defineProps<{
  hadirCount: number
  lateCount: number
  izinCount: number
}>()
</script>

<template>
  <section>
    <h3 class="text-xs font-medium text-muted-foreground mb-3 px-1 uppercase tracking-wider">
      Ringkasan Bulan Ini
    </h3>
    <div class="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
      <div class="flex-shrink-0 px-4 py-3 rounded-xl bg-muted border border-border flex flex-col gap-1 min-w-[110px]">
        <span class="text-xs text-muted-foreground">Hadir</span>
        <span class="text-lg font-semibold text-foreground">{{ hadirCount }}</span>
      </div>
      <div class="flex-shrink-0 px-4 py-3 rounded-xl bg-muted border border-border flex flex-col gap-1 min-w-[110px]">
        <span class="text-xs text-muted-foreground">Terlambat</span>
        <span class="text-lg font-semibold text-warning">{{ lateCount }}</span>
      </div>
      <div class="flex-shrink-0 px-4 py-3 rounded-xl bg-muted border border-border flex flex-col gap-1 min-w-[110px]">
        <span class="text-xs text-muted-foreground">Izin</span>
        <span class="text-lg font-semibold text-muted-foreground">{{ izinCount }}</span>
      </div>
    </div>
  </section>
</template>
```

- [ ] **Step 4: Create GeofenceBadge.vue**

```vue
<script setup lang="ts">
import { MapPin } from 'lucide-vue-next'
import { useStatusStyles } from '@/composables/useStatusStyles'

const props = defineProps<{
  withinRange: boolean
}>()

const statusStyles = useStatusStyles()
const styles = computed(() =>
  props.withinRange ? statusStyles.success : statusStyles.error,
)
</script>

<template>
  <span
    class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full"
    :class="[styles.bg, styles.border].join(' ')"
  >
    <MapPin class="w-3.5 h-3.5" :class="styles.text" />
    <span class="text-xs font-semibold" :class="styles.text">
      {{ withinRange ? 'Dalam Jangkauan' : 'Di Luar Jangkauan' }}
    </span>
  </span>
</template>
```

- [ ] **Step 5: Create ClockInOutCta.vue**

```vue
<script setup lang="ts">
import { LogIn, LogOut } from 'lucide-vue-next'

const props = defineProps<{
  clockedIn: boolean
  loading?: boolean
}>()

const emit = defineEmits<{
  'clock-in': []
  'clock-out': []
}>()
</script>

<template>
  <div class="mb-6">
    <button
      class="w-full h-14 rounded-full flex items-center justify-center gap-2 text-white font-bold text-base shadow-lg transition-transform active:scale-95"
      :class="clockedIn ? 'bg-success hover:bg-success/80' : 'bg-primary hover:bg-primary/80'"
      :disabled="loading"
      @click="clockedIn ? emit('clock-out') : emit('clock-in')"
    >
      <component :is="clockedIn ? LogOut : LogIn" class="w-5 h-5" />
      {{ loading ? 'Memproses...' : clockedIn ? 'Clock Out' : 'Clock In' }}
    </button>
  </div>
</template>
```

- [ ] **Step 6: Create BiometricScanner.vue**

```vue
<script setup lang="ts">
import { Fingerprint } from 'lucide-vue-next'

defineProps<{
  verifying?: boolean
}>()
</script>

<template>
  <div class="flex flex-col items-center justify-center py-12">
    <div
      class="h-32 w-32 rounded-full bg-primary/10 flex items-center justify-center mb-6"
      :class="verifying ? 'animate-pulse' : ''"
    >
      <Fingerprint class="w-16 h-16 text-primary" />
    </div>
    <p class="text-sm text-muted-foreground">
      {{ verifying ? 'Memverifikasi...' : 'Tap untuk absen biometrik' }}
    </p>
  </div>
</template>
```

- [ ] **Step 7: Create VerificationResult.vue**

```vue
<script setup lang="ts">
import { CheckCircle, XCircle } from 'lucide-vue-next'
import { useStatusStyles } from '@/composables/useStatusStyles'

const props = defineProps<{
  success: boolean
  message: string
}>()

const statusStyles = useStatusStyles()
const styles = computed(() => props.success ? statusStyles.success : statusStyles.error)
</script>

<template>
  <div
    class="flex flex-col items-center justify-center py-8 px-4 rounded-xl border"
    :class="[styles.bg, styles.border].join(' ')"
  >
    <component
      :is="success ? CheckCircle : XCircle"
      class="w-16 h-16 mb-4"
      :class="styles.text"
    />
    <p class="text-sm font-medium text-center" :class="styles.text">
      {{ message }}
    </p>
  </div>
</template>
```

- [ ] **Step 8: Create RecentActivity.vue**

```vue
<script setup lang="ts">
defineProps<{
  activities: Array<{
    id: string | number
    time: string
    type: 'clock_in' | 'clock_out' | 'leave'
    label: string
  }>
}>()
</script>

<template>
  <div class="space-y-3">
    <div
      v-for="item in activities"
      :key="item.id"
      class="flex items-center justify-between p-3 rounded-xl bg-card border border-border"
    >
      <div>
        <p class="text-sm font-medium text-foreground">{{ item.label }}</p>
        <p class="text-xs text-muted-foreground mt-0.5">{{ item.time }}</p>
      </div>
      <span
        class="px-2.5 py-1 rounded-full text-xs font-medium"
        :class="item.type === 'clock_in'
          ? 'bg-success/10 text-success'
          : item.type === 'clock_out'
          ? 'bg-primary/10 text-primary'
          : 'bg-warning/10 text-warning'"
      >
        {{ item.type === 'clock_in' ? 'In' : item.type === 'clock_out' ? 'Out' : 'Izin' }}
      </span>
    </div>
    <p v-if="activities.length === 0" class="text-center text-sm text-muted-foreground py-8">
      Belum ada aktivitas recente.
    </p>
  </div>
</template>
```

```bash
git add src/components/pwa/
git commit -m "phase 2: extract PWA component organisms (ClockHeroCard, MonthlySummary, ClockInOutCta, GeofenceBadge, BiometricScanner, VerificationResult, RecentActivity)"
```

- [ ] **Step 9: Refactor AttPwaHomePage.vue to use extracted components**

After creating all components, update `AttPwaHomePage.vue` to:
- Import and use `<ClockHeroCard>`, `<MonthlySummary>`, `<ClockInOutCta>` (or inline GeofenceBadge), and `<SkeletonCard>`
- Remove inline `<section class="bg-white rounded-xl ...">` (clock hero card)
- Remove inline clock CTA logic
- Remove inline monthly summary section
- Delete the duplicated `getDeviceId()` function — use `useAttendance().getDeviceId()` instead
- Wire `useAttendance` composable: `const attendance = useAttendance()`
- Replace `attendanceStore.clockIn()` with `attendance.clockIn()`
- Replace `attendanceStore.clockOut()` with `attendance.clockOut()`
- Import and use `useToast` to replace `alert()` calls

Target after refactor: under 200 lines, ideally ~150 lines.

```bash
git add src/pages/employee/pwa/AttPwaHomePage.vue
git commit -m "phase 2: refactor AttPwaHomePage — use PWA organisms + useAttendance composable"
```

- [ ] **Step 10: Refactor AttPwaAbsenPage.vue to use extracted components**

Decompose `AttPwaAbsenPage.vue` — extract `<BiometricScanner>` and `<VerificationResult>` into `src/components/pwa/`. Use `<RecentActivity>` for the activity list.

```bash
git add src/pages/employee/pwa/AttPwaAbsenPage.vue
git commit -m "phase 2: refactor AttPwaAbsenPage — use PWA organisms"
```

---

### Task 6: Wire useAttendance Composable — Remove Duplicate getDeviceId

**Files:**
- Modify: `src/composables/useAttendance.ts`
- Modify: `src/pages/employee/pwa/AttPwaHomePage.vue`

- [ ] **Step 1: Export getDeviceId from useAttendance.ts**

Read `src/composables/useAttendance.ts`, find the `getDeviceId()` function, and make it a named export (it may already be exported — verify).

```ts
export async function getDeviceId(): Promise<string> {
  let deviceId = localStorage.getItem('device_id')
  if (!deviceId) {
    deviceId = crypto.randomUUID()
    localStorage.setItem('device_id', deviceId)
  }
  return deviceId
}
```

- [ ] **Step 2: Import getDeviceId from useAttendance in AttPwaHomePage**

In `AttPwaHomePage.vue`, remove the inline `getDeviceId()` function (lines 67–74) and import it:

```ts
import { useAttendance } from '@/composables/useAttendance'
import { getDeviceId } from '@/composables/useAttendance' // re-exported for convenience
```

Or better — if `useAttendance` already calls `getDeviceId` internally, just use `attendance.clockIn()` which should handle device ID internally. Verify `useAttendance.ts` — if `clockIn()` already calls `getDeviceId()` internally, then `AttPwaHomePage.vue` should not call `getDeviceId()` separately at all.

```bash
git add src/composables/useAttendance.ts
git commit -m "phase 2: export getDeviceId from useAttendance"
```

---

## Phase 3 — UX Hardening

### Task 7: Fix PWA Layout — Touch Targets, Safe-Area, Back Button

**Files:**
- Modify: `src/layouts/AppPwaLayout.vue`

- [ ] **Step 1: Fix bottom nav touch targets**

Find the nav `RouterLink` items in `AppPwaLayout.vue`. Replace the nav item class:

Find:
```vue
class="flex flex-col items-center justify-center px-4 py-1 transition-colors duration-150"
```

Replace with:
```vue
class="flex flex-col items-center justify-center px-4 py-2.5 min-h-[44px] min-w-[44px] transition-colors duration-150"
```

- [ ] **Step 2: Fix active state using Shadcn tokens**

After Task 2 (Stitch→Shadcn migration), the active nav item class should be:
```vue
isActive(item.name)
  ? 'bg-primary/10 text-primary rounded-full'
  : 'text-muted-foreground hover:bg-muted transition-colors'
```

- [ ] **Step 3: Convert :style safe-area to Tailwind arbitrary utilities**

Remove all `:style` bindings from header, main, and nav elements. Replace with Tailwind arbitrary values:

Header: Add `pt-[env(safe-area-inset-top)]` to the header's class attribute.
Main: Add `pb-[calc(6rem+env(safe-area-inset-bottom))]` to the main class.
Nav: Add `pt-[env(safe-area-inset-top)]` and `pb-[calc(0.5rem+env(safe-area-inset-bottom))]` to the nav class. Remove the `borderRadius` from style binding — use `rounded-t-2xl` in class instead.

- [ ] **Step 4: Hide back button on /pwa/home route**

In the `goBack` function, check the route and hide the back button on the home route:

```vue
<!-- Left: Back button slot — only show on non-home routes -->
<div class="w-10">
  <button
    v-if="route.path !== '/pwa/home'"
    class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
    aria-label="Go back"
    @click="goBack"
  >
    <ArrowLeft class="w-5 h-5 text-foreground" />
  </button>
</div>
```

```bash
git add src/layouts/AppPwaLayout.vue
git commit -m "phase 3: fix PWA layout — 44px touch targets, Tailwind safe-area, conditional back button"
```

---

### Task 8: Install Sonner Toast + Create useToast Composable

**Files:**
- Create: `src/components/ui/sonner/Sonner.vue`
- Create: `src/components/ui/sonner/index.ts`
- Create: `src/composables/useToast.ts`
- Modify: `src/pages/employee/pwa/AttPwaHomePage.vue`
- Modify: `src/pages/employee/HistoryPage.vue` (if applicable)

- [ ] **Step 1: Install shadcn-vue Sonner**

If using shadcn-vue CLI:
```bash
npx shadcn-vue@latest add sonner
```

If manually, create `src/components/ui/sonner/Sonner.vue`:
```vue
<script setup lang="ts">
import { Toaster as Sonner } from 'vue-sonner'

defineOptions({ inheritAttrs: false })
</script>

<template>
  <Sonner
    class="toaster group"
    theme="light"
    :toast-options="{
      classes: {
        toast: 'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg',
        actionButton: 'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
        cancelButton: 'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
      },
    }"
  />
</template>
```

Create `src/components/ui/sonner/index.ts`:
```ts
export { default as Sonner } from './Sonner.vue'
```

- [ ] **Step 2: Create useToast composable**

```ts
// src/composables/useToast.ts
import { toast } from 'vue-sonner'

export function useToast() {
  return {
    success(message: string): void {
      toast.success(message)
    },
    error(message: string): void {
      toast.error(message)
    },
    warning(message: string): void {
      toast.warning(message)
    },
    info(message: string): void {
      toast.info(message)
    },
  }
}
```

- [ ] **Step 3: Add Sonner to App.vue**

In `src/App.vue`, add the Sonner component inside `<RouterView />`:
```vue
<script setup lang="ts">
import { RouterView } from 'vue-router'
import { Sonner } from '@/components/ui/sonner'
</script>

<template>
  <RouterView />
  <Sonner />
</template>
```

- [ ] **Step 4: Replace alert() calls in AttPwaHomePage.vue**

Find all `alert(msg)` calls and replace with `useToast().error(msg)`:

```ts
import { useToast } from '@/composables/useToast'

const toast = useToast()

// Replace alert(msg) with:
toast.error(msg)
```

```bash
git add src/components/ui/sonner/ src/composables/useToast.ts src/App.vue src/pages/employee/pwa/AttPwaHomePage.vue
git commit -m "phase 3: add Sonner toast system — replace alert() calls"
```

---

### Task 9: Fix 401 Interceptor — SPA-Safe Redirect

**Files:**
- Modify: `src/services/api/client.ts`

- [ ] **Step 1: Review Task 3 Step 1**

If not yet done as part of Task 3, apply the fix: remove the Bearer interceptor, ensure `withCredentials: true`, and replace `window.location.href` with Vue Router `router.push()`.

The current code in `client.ts` (line 28) is:
```ts
window.location.href = '/auth/login'
```

Replace with:
```ts
import router from '@/router'
// ... inside interceptor:
router.push('/auth/login')
```

Remove the `import { useAuthStore }` at the top of the interceptor — authStore is still needed for `clearAuth()`.

```bash
git add src/services/api/client.ts
git commit -m "phase 3: fix 401 interceptor — SPA-safe router.push redirect"
```

---

### Task 10: Add SkeletonCard to HistoryPage Loading State

**Files:**
- Modify: `src/pages/employee/HistoryPage.vue`

- [ ] **Step 1: Replace loading text with SkeletonCard**

Find in `HistoryPage.vue`:
```vue
<div v-if="isLoading" class="text-center py-12">
  <p class="text-muted-foreground">
    Loading...
  </p>
</div>
```

Replace with:
```vue
<div v-if="isLoading" class="space-y-3">
  <SkeletonCard :lines="3" />
  <SkeletonCard :lines="2" />
  <SkeletonCard :lines="4" />
</div>
```

Import `SkeletonCard` at the top of the `<script setup>`:
```ts
import SkeletonCard from '@/components/shared/SkeletonCard.vue'
```

```bash
git add src/pages/employee/HistoryPage.vue
git commit -m "phase 3: replace Loading text with SkeletonCard in HistoryPage"
```

---

## Phase 4 — Polish

### Task 11: Create useDateFormat Composable

**Files:**
- Create: `src/composables/useDateFormat.ts`
- Modify: `src/pages/employee/HistoryPage.vue`
- Modify: `src/pages/employee/pwa/AttPwaRiwayatPage.vue`

- [ ] **Step 1: Write the failing test**

```ts
// src/__tests__/composables/useDateFormat.test.ts
import { describe, it, expect } from 'vitest'
import { useDateFormat } from '@/composables/useDateFormat'

describe('useDateFormat', () => {
  const { formatDate, formatTime, formatDateTime } = useDateFormat()

  it('formatDate returns a non-empty string', () => {
    const result = formatDate(new Date('2026-05-14T08:30:00').toISOString())
    expect(typeof result).toBe('string')
    expect(result.length).toBeGreaterThan(0)
  })

  it('formatTime returns a time string (contains :)', () => {
    const result = formatTime(new Date('2026-05-14T08:30:00').toISOString())
    expect(result).toMatch(/^\d{2}:\d{2}/)
  })

  it('formatDateTime returns combined date + time', () => {
    const result = formatDateTime(new Date('2026-05-14T08:30:00').toISOString())
    expect(result).toMatch(/08:30/)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run src/__tests__/composables/useDateFormat.test.ts
```
Expected: **FAIL** — file does not exist.

- [ ] **Step 3: Write the composable**

Create `src/composables/useDateFormat.ts`:

```ts
/**
 * useDateFormat.ts
 *
 * Provides date and time formatting utilities using the Indonesian locale.
 * Replaces inline formatDate/formatTime helpers scattered across pages.
 *
 * @packageDocumentation
 */

/**
 * Formats an ISO date string to an Indonesian date string.
 * e.g. "2026-05-14T08:30:00" → "14 Mei 2026"
 */
export function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

/**
 * Formats an ISO date string to a time string (24-hour).
 * e.g. "2026-05-14T08:30:00" → "08:30"
 */
export function formatTime(isoString: string): string {
  return new Date(isoString).toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

/**
 * Formats an ISO date string to a full Indonesian datetime string.
 * e.g. "2026-05-14T08:30:00" → "14 Mei 2026 08:30"
 */
export function formatDateTime(isoString: string): string {
  return `${formatDate(isoString)} ${formatTime(isoString)}`
}

export function useDateFormat() {
  return { formatDate, formatTime, formatDateTime }
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run src/__tests__/composables/useDateFormat.test.ts
```
Expected: **PASS**

- [ ] **Step 5: Replace inline date helpers in HistoryPage.vue**

Remove the inline `formatDate` and `formatTime` functions from `HistoryPage.vue`. Import `useDateFormat` at the top:

```ts
import { useDateFormat } from '@/composables/useDateFormat'

const { formatDate, formatTime } = useDateFormat()
```

- [ ] **Step 6: Replace inline date helpers in AttPwaRiwayatPage.vue**

Apply the same pattern. Import `useDateFormat`, remove inline computed date formatting.

```bash
git add src/composables/useDateFormat.ts
git add src/__tests__/composables/useDateFormat.test.ts
git add src/pages/employee/HistoryPage.vue src/pages/employee/pwa/AttPwaRiwayatPage.vue
git commit -m "phase 4: add useDateFormat composable — replace inline date helpers"
```

---

### Task 12: Create extractApiError Utility

**Files:**
- Create: `src/__tests__/lib/utils.test.ts`
- Modify: `src/lib/utils.ts`
- Modify: All store files (attendanceStore, leaveStore, authStore)

- [ ] **Step 1: Write the failing test**

```ts
// src/__tests__/lib/utils.test.ts
import { describe, it, expect } from 'vitest'
import { extractApiError } from '@/lib/utils'

describe('extractApiError', () => {
  it('extracts message from Axios error response.data.message', () => {
    const err = {
      response: { data: { message: 'Token expired' } },
      isAxiosError: true,
    }
    expect(extractApiError(err)).toBe('Token expired')
  })

  it('falls back to err.message for plain Error', () => {
    const err = new Error('Network failure')
    expect(extractApiError(err)).toBe('Network failure')
  })

  it('falls back to string for unknown error shapes', () => {
    expect(extractApiError('Something went wrong')).toBe('Something went wrong')
    expect(extractApiError(null)).toBe('Terjadi kesalahan yang tidak diketahui')
    expect(extractApiError(undefined)).toBe('Terjadi kesalahan yang tidak diketahui')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run src/__tests__/lib/utils.test.ts
```
Expected: **FAIL** — function not defined.

- [ ] **Step 3: Add extractApiError to lib/utils.ts**

Read `src/lib/utils.ts` first, then append:

```ts
/**
 * Extracts a human-readable error message from an unknown error.
 * Handles Axios errors (server response), plain Errors, and string/unknown values.
 *
 * Priority:
 * 1. err.response?.data?.message  (Axios server error)
 * 2. err.message                  (plain Error)
 * 3. String(err)                   (fallback string)
 * 4. 'Terjadi kesalahan yang tidak diketahui' (null/undefined fallback)
 */
export function extractApiError(err: unknown): string {
  if (err === null || err === undefined) {
    return 'Terjadi kesalahan yang tidak diketahui'
  }
  if (typeof err === 'string') {
    return err
  }
  if (err instanceof Error) {
    const axiosErr = err as { response?: { data?: { message?: string } } }
    if (axiosErr.response?.data?.message) {
      return axiosErr.response.data.message
    }
    return err.message
  }
  return String(err)
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run src/__tests__/lib/utils.test.ts
```
Expected: **PASS**

- [ ] **Step 5: Update store files to use extractApiError**

Replace all occurrences of `err instanceof Error ? err.message : 'fallback'` pattern in:
- `src/stores/attendanceStore.ts`
- `src/stores/leaveStore.ts`
- `src/stores/authStore.ts`

With:
```ts
import { extractApiError } from '@/lib/utils'

// Then in catch blocks:
} catch (err: unknown) {
  error.value = extractApiError(err)
}
```

```bash
git add src/lib/utils.ts
git add src/__tests__/lib/utils.test.ts
git add src/stores/attendanceStore.ts src/stores/leaveStore.ts src/stores/authStore.ts
git commit -m "phase 4: add extractApiError utility — standardize error extraction in stores"
```

---

## Testing Track — Unit Tests (Parallel with Implementation)

### Track 1A: useAuth Unit Tests

**Files:**
- Create: `src/__tests__/composables/useAuth.test.ts`

- [ ] **Write test for useAuth composable**

```ts
// src/__tests__/composables/useAuth.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useAuth } from '@/composables/useAuth'

// Mock authApi
vi.mock('@/services/api/authApi', () => ({
  authApi: {
    login: vi.fn(),
    logout: vi.fn(),
  },
}))

// Mock authStore
vi.mock('@/stores/authStore', () => ({
  useAuthStore: vi.fn(() => ({
    isLoading: false,
    user: null,
    setAuth: vi.fn(),
    clearAuth: vi.fn(),
  })),
}))

describe('useAuth', () => {
  it('login returns success:true on successful response', async () => {
    const { authApi } = await import('@/services/api/authApi')
    vi.mocked(authApi.login).mockResolvedValue({ success: true, data: { user: {} } })
    const { login } = useAuth()
    const result = await login('test@example.com', 'password123')
    expect(result.success).toBe(true)
  })

  it('login returns success:false with message on failed response', async () => {
    const { authApi } = await import('@/services/api/authApi')
    vi.mocked(authApi.login).mockResolvedValue({ success: false, message: 'Invalid credentials' })
    const { login } = useAuth()
    const result = await login('bad@example.com', 'wrongpass')
    expect(result.success).toBe(false)
    expect(result.message).toBe('Invalid credentials')
  })
})
```

### Track 1B: useAttendance Unit Tests

**Files:**
- Create: `src/__tests__/composables/useAttendance.test.ts`

- [ ] **Write test for useAttendance composable**

```ts
// src/__tests__/composables/useAttendance.test.ts
import { describe, it, expect, vi } from 'vitest'
import { getDeviceId } from '@/composables/useAttendance'

describe('useAttendance', () => {
  describe('getDeviceId', () => {
    it('returns existing device_id from localStorage', async () => {
      vi.stubGlobal('localStorage', {
        getItem: vi.fn((key) => {
          if (key === 'device_id') return 'existing-device-uuid'
          return null
        }),
        setItem: vi.fn(),
      })
      const result = await getDeviceId()
      expect(result).toBe('existing-device-uuid')
      vi.stubGlobal('localStorage', globalThis.localStorage)
    })

    it('generates and stores new device_id when none exists', async () => {
      let stored = ''
      vi.stubGlobal('localStorage', {
        getItem: vi.fn(() => null),
        setItem: vi.fn((_, val) => { stored = val }),
      })
      const result = await getDeviceId()
      expect(result).toMatch(/^[0-9a-f-]{36}$/) // UUID format
      vi.stubGlobal('localStorage', globalThis.localStorage)
    })
  })
})
```

---

## Testing Track — E2E Tests (Playwright)

### Track 2A: Auth E2E Tests

**Files:**
- Create: `e2e/auth.spec.ts`

- [ ] **Write Playwright auth tests**

```ts
// e2e/auth.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Auth Flow', () => {
  test('shows login page at /auth/login', async ({ page }) => {
    await page.goto('/auth/login')
    await expect(page.getByRole('heading', { name: /HRIS/i })).toBeVisible()
    await expect(page.getByLabel(/Email/i)).toBeVisible()
    await expect(page.getByLabel(/Password/i)).toBeVisible()
  })

  test('shows validation errors on empty submit', async ({ page }) => {
    await page.goto('/auth/login')
    await page.getByRole('button', { name: /Sign in/i }).click()
    await expect(page.getByText(/Email is required/i)).toBeVisible()
  })

  test('logs in with valid credentials and redirects', async ({ page }) => {
    await page.goto('/auth/login')
    await page.getByLabel(/Email/i).fill('admin@company.com')
    await page.getByLabel(/Password/i).fill('password123')
    await page.getByRole('button', { name: /Sign in/i }).click()
    // Expect redirect to /admin or /pwa/home
    await expect(page).toHaveURL(/\/(admin|pwa\/home)/)
  })

  test('shows error on invalid credentials', async ({ page }) => {
    await page.goto('/auth/login')
    await page.getByLabel(/Email/i).fill('bad@company.com')
    await page.getByLabel(/Password/i).fill('wrongpassword')
    await page.getByRole('button', { name: /Sign in/i }).click()
    await expect(page.getByText(/Login failed/i)).toBeVisible()
  })
})
```

### Track 2B: Attendance E2E Tests

**Files:**
- Create: `e2e/attendance.spec.ts`

- [ ] **Write Playwright attendance tests**

```ts
// e2e/attendance.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Attendance Clock In/Out', () => {
  test.beforeEach(async ({ page }) => {
    // Log in first (assumes valid credentials)
    await page.goto('/auth/login')
    await page.getByLabel(/Email/i).fill('employee@company.com')
    await page.getByLabel(/Password/i).fill('password123')
    await page.getByRole('button', { name: /Sign in/i }).click()
    await page.waitForURL('/pwa/home')
  })

  test('shows clock in button when not clocked in', async ({ page }) => {
    await page.goto('/pwa/home')
    await expect(page.getByRole('button', { name: /Clock In/i })).toBeVisible()
  })

  test('shows clock out button when clocked in', async ({ page }) => {
    // First clock in
    await page.goto('/pwa/home')
    const clockBtn = page.getByRole('button', { name: /Clock In/i })
    if (await clockBtn.isVisible()) {
      await clockBtn.click()
      await page.waitForResponse(/\/api\/v1\/attendance/)
    }
    await expect(page.getByRole('button', { name: /Clock Out/i })).toBeVisible()
  })
})
```

### Track 2C: PWA Navigation E2E Tests

**Files:**
- Create: `e2e/pwa-navigation.spec.ts`

- [ ] **Write Playwright PWA nav tests**

```ts
// e2e/pwa-navigation.spec.ts
import { test, expect } from '@playwright/test'

test.describe('PWA Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/login')
    await page.getByLabel(/Email/i).fill('employee@company.com')
    await page.getByLabel(/Password/i).fill('password123')
    await page.getByRole('button', { name: /Sign in/i }).click()
    await page.waitForURL('/pwa/home')
  })

  test('bottom nav has 4 items: Home, Absen, Riwayat, Profil', async ({ page }) => {
    await page.goto('/pwa/home')
    await expect(page.getByRole('link', { name: /Home/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /Absen/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /Riwayat/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /Profil/i })).toBeVisible()
  })

  test('navigates to Absen page from nav', async ({ page }) => {
    await page.goto('/pwa/home')
    await page.getByRole('link', { name: /Absen/i }).click()
    await expect(page).toHaveURL(/\/pwa\/absen/)
  })

  test('navigates to Riwayat page from nav', async ({ page }) => {
    await page.goto('/pwa/home')
    await page.getByRole('link', { name: /Riwayat/i }).click()
    await expect(page).toHaveURL(/\/pwa\/riwayat/)
  })

  test('navigates to Profil page from nav', async ({ page }) => {
    await page.goto('/pwa/home')
    await page.getByRole('link', { name: /Profil/i }).click()
    await expect(page).toHaveURL(/\/pwa\/profil/)
  })

  test('back button hidden on /pwa/home', async ({ page }) => {
    await page.goto('/pwa/home')
    await expect(page.getByLabel(/Go back/i)).not.toBeVisible()
  })

  test('back button visible on /pwa/absen', async ({ page }) => {
    await page.goto('/pwa/absen')
    await expect(page.getByLabel(/Go back/i)).toBeVisible()
  })
})
```

---

## Final: Branch, PR & Verification

- [ ] **Create branch:** `git checkout -b refactor/frontend-architecture`
- [ ] **Verify no alert() calls remain:** `grep -rn "alert(" src/` → should return zero results
- [ ] **Verify no HelloWorld.vue:** `ls src/components/HelloWorld.vue` → should fail
- [ ] **Verify no stitch- classes in components:** `grep -rn "stitch-" src/` → should return zero results
- [ ] **Run all unit tests:** `npx vitest run` → all tests pass
- [ ] **Run all E2E tests:** `npx playwright test` → all tests pass
- [ ] **Squash and merge** to `main` via PR on GitHub

---

## Spec Coverage Check

| Spec Requirement | Task(s) |
|---|---|
| Delete `HelloWorld.vue` + strip `style.css` | Task 1 |
| Unify Stitch → Shadcn tokens | Task 2 |
| Fix `useStatusStyles` literal colors | Task 2, Step 1 |
| Fix auth flow (cookie auth, remove Bearer) | Task 3 |
| Replace `bg-white` with `bg-card` | Task 2, Steps 3–5 |
| Replace `bg-amber-400` with `bg-warning` | Task 2, Step 5 |
| Extract PWA organisms | Task 5, Steps 2–10 |
| Wire `useAttendance` composable | Task 6 |
| Wire `useAuth` composable in LoginPage | Task 3, Step 3 |
| Fix bottom nav 44px touch targets | Task 7, Step 1 |
| Convert `:style` safe-area → Tailwind utilities | Task 7, Step 3 |
| Install Sonner + replace `alert()` | Task 8 |
| Fix 401 interceptor (`window.location.href` → router) | Task 9 |
| SkeletonCard in HistoryPage | Task 10 |
| `useDateFormat` composable | Task 11 |
| `extractApiError()` utility | Task 12 |
| Remove dead `status.*` config | Task 2, Step 2 |
| Unit tests (Vitest) | Tasks 4, 11, Track 1A, Track 1B |
| E2E tests (Playwright) | Track 2A, 2B, 2C |