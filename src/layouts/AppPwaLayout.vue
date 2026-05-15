<script setup lang="ts">
/**
 * AppPwaLayout.vue
 *
 * Mobile-first PWA shell layout for the Employee Attendance PWA.
 * Provides a fixed top app bar, scrollable content slot, and fixed bottom navigation bar.
 * Uses Stitch design tokens (stitch-* Tailwind classes).
 *
 * @packageDocumentation
 */
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Home, Fingerprint, History, User, ArrowLeft } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()

// Map current path to active tab name
const activeTab = computed(() => {
  const path = route.path
  if (path.includes('/home')) return 'home'
  if (path.includes('/absen')) return 'absen'
  if (path.includes('/riwayat')) return 'riwayat'
  if (path.includes('/profil')) return 'profil'
  return 'home'
})

const navItems = [
  { name: 'home', label: 'Home', to: '/pwa/home', icon: Home },
  { name: 'absen', label: 'Absen', to: '/pwa/absen', icon: Fingerprint },
  { name: 'riwayat', label: 'Riwayat', to: '/pwa/riwayat', icon: History },
  { name: 'profil', label: 'Profil', to: '/pwa/profil', icon: User },
]

function isActive(name: string): boolean {
  return activeTab.value === name
}

function goBack(): void {
  router.back()
}
</script>

<template>
  <div class="flex flex-col h-screen bg-stitch-surface overflow-hidden">
    <!-- ── Top App Bar ─────────────────────────────────────────── -->
    <header
      class="fixed top-0 left-0 right-0 z-50 h-16 bg-white border-b border-stitch-outline-variant
             flex items-center justify-between px-4 shadow-sm"
      :style="{ paddingTop: 'env(safe-area-inset-top)' }"
    >
      <!-- Left: Back button slot -->
      <div class="w-10">
        <button
          class="w-10 h-10 flex items-center justify-center rounded-full
                 hover:bg-stitch-surface-container-high transition-colors"
          aria-label="Go back"
          @click="goBack"
        >
          <ArrowLeft class="w-5 h-5 text-stitch-primary" />
        </button>
      </div>

      <!-- Center: Page title slot -->
      <div class="flex-1 text-center">
        <slot name="title">
          <span class="text-base font-semibold text-stitch-primary font-sans">
            Attendance Pro
          </span>
        </slot>
      </div>

      <!-- Right: Action slot -->
      <div class="w-10 flex justify-end">
        <slot name="actions" />
      </div>
    </header>

    <!-- ── Page Content ───────────────────────────────────────── -->
    <main
      class="flex-1 overflow-y-auto pt-16 px-4"
      :style="{ paddingBottom: 'calc(6rem + env(safe-area-inset-bottom))' }"
    >
      <slot />
    </main>

    <!-- ── Bottom Navigation Bar ──────────────────────────────── -->
    <nav
      class="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-stitch-outline-variant
             shadow-lg flex justify-around items-center px-4"
      :style="{
        paddingBottom: 'calc(0.5rem + env(safe-area-inset-bottom))',
        paddingTop: 'env(safe-area-inset-top)',
        borderRadius: '1rem 1rem 0 0',
      }"
    >
      <RouterLink
        v-for="item in navItems"
        :key="item.name"
        :to="item.to"
        class="flex flex-col items-center justify-center px-4 py-1 transition-colors duration-150"
        :class="[
          isActive(item.name)
            ? 'bg-stitch-primary-container text-stitch-on-primary-container rounded-full'
            : 'text-stitch-on-surface-variant hover:bg-stitch-surface-container transition-colors'
        ]"
      >
        <component
          :is="item.icon"
          :size="22"
          :stroke-width="isActive(item.name) ? 2.5 : 2"
        />
        <span class="text-[11px] font-medium mt-0.5">{{ item.label }}</span>
      </RouterLink>
    </nav>
  </div>
</template>
