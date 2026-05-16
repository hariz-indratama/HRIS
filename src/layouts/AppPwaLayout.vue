<script setup lang="ts">
/**
 * AppPwaLayout.vue
 *
 * Mobile-first PWA shell layout for the Employee Attendance PWA.
 * Provides a fixed top app bar, scrollable content slot, and fixed bottom navigation bar.
 * Uses Shadcn semantic design tokens.
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
  <div class="flex flex-col h-screen bg-background overflow-hidden">
    <!-- ── Top App Bar ─────────────────────────────────────────── -->
    <header
      class="fixed top-0 left-0 right-0 z-50 h-16 bg-card border-b border-border
             flex items-center justify-between px-4 shadow-sm pt-[env(safe-area-inset-top)]"
    >
      <!-- Left: Back button — only show on non-home routes -->
      <div class="w-10">
        <button
          v-if="route.path !== '/pwa/home'"
          class="w-10 h-10 flex items-center justify-center rounded-full
                 hover:bg-muted/50 transition-colors"
          aria-label="Go back"
          @click="goBack"
        >
          <ArrowLeft class="w-5 h-5 text-foreground" />
        </button>
      </div>

      <!-- Center: Page title slot -->
      <div class="flex-1 text-center">
        <slot name="title">
          <span class="text-base font-semibold text-foreground font-sans">
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
      class="flex-1 overflow-y-auto pt-16 px-4 pb-[calc(6rem+env(safe-area-inset-bottom))]"
    >
      <slot />
    </main>

    <!-- ── Bottom Navigation Bar ──────────────────────────────── -->
    <nav
      class="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border
             shadow-lg flex justify-around items-center px-4 pt-[env(safe-area-inset-top)]
             pb-[calc(0.5rem+env(safe-area-inset-bottom))] rounded-t-xl"
    >
      <RouterLink
        v-for="item in navItems"
        :key="item.name"
        :to="item.to"
        class="flex flex-col items-center justify-center px-4 py-2.5 min-h-[44px] min-w-[44px] transition-colors duration-150"
        :class="[
          isActive(item.name)
            ? 'bg-primary/10 text-primary rounded-full'
            : 'text-muted-foreground hover:bg-muted transition-colors'
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
