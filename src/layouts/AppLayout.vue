<template>
  <div class="flex h-screen overflow-hidden bg-background">
    <AppSidebar />

    <!-- Mobile sidebar backdrop -->
    <div
      v-if="isSidebarOpen"
      class="fixed inset-0 z-40 bg-black/50 max-md:block hidden"
      @click="toggleSidebar"
    />

    <!-- Main content -->
    <div class="flex flex-col flex-1 overflow-hidden">
      <!-- Top bar -->
      <header class="flex items-center justify-between h-16 px-6 bg-card border-b border-border">
        <button
          class="p-2 rounded-md hover:bg-accent md:hidden"
          aria-label="Open menu"
          @click="toggleSidebar"
        >
          <Menu
            :size="20"
            class="text-muted-foreground"
          />
        </button>
        <div class="flex items-center gap-3 ml-auto">
          <div class="flex items-center gap-2">
            <div class="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-medium">
              {{ userInitials }}
            </div>
            <span class="text-sm font-medium text-foreground hidden sm:block">
              {{ authStore.user?.name ?? 'User' }}
            </span>
          </div>
        </div>
      </header>

      <!-- Page content -->
      <main class="flex-1 overflow-y-auto p-6">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import AppSidebar from '@/components/shared/AppSidebar.vue'
import { useSidebarState } from '@/composables/useSidebarState'

const router = useRouter()
const authStore = useAuthStore()
const { isOpen: isSidebarOpen, toggle: toggleSidebar } = useSidebarState()

const userInitials = computed(() => {
  const name = authStore.user?.name ?? ''
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

</script>