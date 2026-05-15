<script setup lang="ts">
/**
 * AppSidebar.vue
 *
 * Shared sidebar navigation component.
 * Displays a list of navigation items with icons, supports active state highlighting
 * and role-based filtering (employee vs admin).
 *
 * @packageDocumentation
 */
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  DollarSign,
  Home,
  LayoutDashboard,
  Users,
  type LucideIcon,
} from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/authStore'
import { cn } from '@/lib/utils'

// ─── Types ────────────────────────────────────────────────────────────────────

interface NavItem {
  name: string
  icon: string
  route: string
}

// ─── Props & Emits ────────────────────────────────────────────────────────────

const props = defineProps<{
  isOpen: boolean
  items?: NavItem[]
}>()

const emit = defineEmits<{
  toggle: []
}>()

// ─── Stores ───────────────────────────────────────────────────────────────────

const authStore = useAuthStore()
const route = useRoute()

// ─── Icon Map ─────────────────────────────────────────────────────────────────

const iconMap: Record<string, LucideIcon> = {
  Home,
  Clock,
  Calendar,
  LayoutDashboard,
  Users,
  DollarSign,
}

// ─── Computed ─────────────────────────────────────────────────────────────────

/** Default nav items based on user role */
const navItems = computed<NavItem[]>(() => {
  if (authStore.isAdmin) {
    return (
      props.items ?? [
        { name: 'Dashboard', icon: 'LayoutDashboard', route: '/admin' },
        { name: 'Employees', icon: 'Users', route: '/admin/employees' },
        { name: 'Payroll', icon: 'DollarSign', route: '/admin/payroll' },
      ]
    )
  }

  return (
    props.items ?? [
      { name: 'Dashboard', icon: 'Home', route: '/' },
      { name: 'History', icon: 'Clock', route: '/history' },
      { name: 'Leave Request', icon: 'Calendar', route: '/leave' },
    ]
  )
})

// ─── Helpers ───────────────────────────────────────────────────────────────────

function isActive(item: NavItem): boolean {
  return route.path === item.route
}
</script>

<template>
  <aside
    :class="
      cn(
        'bg-background border-r border-border flex flex-col h-full transition-all duration-300',
        isOpen ? 'w-64' : 'w-16',
      )
    "
  >
    <!-- Toggle button -->
    <div class="flex justify-end p-2">
      <Button
        variant="ghost"
        size="icon"
        class="text-muted-foreground hover:text-foreground h-8 w-8"
        :aria-label="isOpen ? 'Collapse sidebar' : 'Expand sidebar'"
        @click="emit('toggle')"
      >
        <ChevronLeft
          v-if="isOpen"
          class="size-4"
        />
        <ChevronRight
          v-else
          class="size-4"
        />
      </Button>
    </div>

    <!-- Navigation list -->
    <nav
      class="flex flex-col gap-1 px-2 pb-4"
      aria-label="Sidebar navigation"
    >
      <template
        v-for="item in navItems"
        :key="item.route"
      >
        <RouterLink
          :to="item.route"
          :class="
            cn(
              'flex items-center gap-3 h-10 px-3 rounded-md text-sm font-medium transition-colors relative',
              isActive(item)
                ? 'bg-primary/10 text-primary border-r-2 border-primary'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              !isOpen && 'justify-center px-0',
            )
          "
          :aria-current="isActive(item) ? 'page' : undefined"
        >
          <component
            :is="iconMap[item.icon]"
            class="size-5 shrink-0"
            aria-hidden="true"
          />
          <span
            v-if="isOpen"
            class="truncate"
          >{{ item.name }}</span>
        </RouterLink>
      </template>
    </nav>
  </aside>
</template>