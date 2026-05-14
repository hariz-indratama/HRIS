<template>
  <div class="flex h-screen overflow-hidden bg-background">
    <!-- Sidebar -->
    <aside
      :class="[
        'flex flex-col bg-card border-r border-border transition-all duration-300',
        isSidebarOpen ? 'w-64' : 'w-16',
        'max-md:fixed max-md:z-50 max-md:h-full',
        isSidebarOpen ? 'max-md:translate-x-0' : 'max-md:-translate-x-full',
      ]"
    >
      <!-- Logo / App Name -->
      <div class="flex items-center h-16 px-4 border-b border-border">
        <span v-if="isSidebarOpen" class="text-lg font-bold text-foreground">HRIS</span>
        <button
          class="p-2 rounded-md hover:bg-accent max-md:hidden"
          @click="toggleSidebar"
          aria-label="Toggle sidebar"
        >
          <Menu :size="20" class="text-muted-foreground" />
        </button>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 px-2 py-4 space-y-1">
        <template v-if="authStore.isAdmin">
          <RouterLink
            v-for="item in adminNavItems"
            :key="item.name"
            :to="item.to"
            class="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            active-class="bg-accent text-foreground"
          >
            <component :is="item.icon" :size="20" />
            <span v-if="isSidebarOpen">{{ item.label }}</span>
          </RouterLink>
        </template>
        <template v-else>
          <RouterLink
            v-for="item in employeeNavItems"
            :key="item.name"
            :to="item.to"
            class="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            active-class="bg-accent text-foreground"
          >
            <component :is="item.icon" :size="20" />
            <span v-if="isSidebarOpen">{{ item.label }}</span>
          </RouterLink>
        </template>
      </nav>

      <!-- Logout -->
      <div class="px-2 py-4 border-t border-border">
        <button
          class="flex items-center gap-3 w-full px-3 py-2.5 rounded-md text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-accent transition-colors"
          @click="handleLogout"
        >
          <LogOut :size="20" />
          <span v-if="isSidebarOpen">Logout</span>
        </button>
      </div>
    </aside>

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
          @click="toggleSidebar"
          aria-label="Open menu"
        >
          <Menu :size="20" class="text-muted-foreground" />
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
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import {
  Home,
  Clock,
  Calendar,
  Users,
  DollarSign,
  LogOut,
  Menu,
} from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()
const isSidebarOpen = ref(false)

const employeeNavItems = [
  { name: 'dashboard', label: 'Home', to: '/', icon: Home },
  { name: 'history', label: 'History', to: '/history', icon: Clock },
  { name: 'leave-request', label: 'Leave Request', to: '/leave', icon: Calendar },
]

const adminNavItems = [
  { name: 'admin-dashboard', label: 'Dashboard', to: '/admin', icon: Home },
  { name: 'admin-employees', label: 'Employees', to: '/admin/employees', icon: Users },
  { name: 'admin-payroll', label: 'Payroll', to: '/admin/payroll', icon: DollarSign },
]

const userInitials = computed(() => {
  const name = authStore.user?.name ?? ''
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

function toggleSidebar(): void {
  isSidebarOpen.value = !isSidebarOpen.value
}

function handleLogout(): void {
  authStore.clearAuth()
  router.push('/auth/login')
}
</script>