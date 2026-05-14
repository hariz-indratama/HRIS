<script setup lang="ts">
/**
 * AppHeader.vue
 *
 * Shared application header component.
 * Displays app branding on the left and user info (avatar, name, role badge) on the right.
 * Includes notification bell, user menu, and logout action.
 *
 * @packageDocumentation
 */
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { Bell, LogOut, User } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/authStore'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const authStore = useAuthStore()
const router = useRouter()

const userInitials = computed(() => {
  const name = authStore.user?.name ?? 'U'
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

const roleVariant = computed(() => {
  return authStore.isAdmin ? 'destructive' : 'secondary'
})

const roleLabel = computed(() => {
  return authStore.isAdmin ? 'Admin' : 'Employee'
})

function handleLogout(): void {
  authStore.clearAuth()
  router.push('/auth/login')
}
</script>

<template>
  <header
    class="bg-background border-b border-border flex h-16 w-full items-center justify-between px-4 md:px-6"
  >
    <!-- Brand -->
    <div class="flex items-center gap-3">
      <div
        class="bg-primary text-primary-foreground flex h-9 w-9 items-center justify-center rounded-lg font-bold text-sm"
      >
        HR
      </div>
      <span class="text-foreground font-semibold text-lg hidden sm:block">HRIS App</span>
    </div>

    <!-- Right side: user info + actions -->
    <div class="flex items-center gap-3">
      <!-- Notifications -->
      <Button
        variant="ghost"
        size="icon"
        class="relative text-muted-foreground hover:text-foreground"
        aria-label="Notifications"
      >
        <Bell class="size-5" />
        <!-- Notification dot -->
        <span
          class="bg-destructive absolute top-2 right-2 h-2 w-2 rounded-full"
          aria-hidden="true"
        />
      </Button>

      <!-- User avatar + name + role -->
      <div class="flex items-center gap-3">
        <!-- Avatar -->
        <Avatar size="sm" class="hidden sm:flex">
          <AvatarFallback class="bg-muted text-muted-foreground text-xs font-medium">
            {{ userInitials }}
          </AvatarFallback>
        </Avatar>

        <!-- Name + Role -->
        <div class="hidden flex-col items-start md:flex">
          <span class="text-foreground text-sm font-medium leading-none">
            {{ authStore.user?.name ?? 'Unknown' }}
          </span>
          <Badge :variant="roleVariant" class="mt-0.5 px-1.5 py-0 text-[10px]">
            {{ roleLabel }}
          </Badge>
        </div>
      </div>

      <!-- Divider -->
      <div class="bg-border hidden h-8 w-px md:block" aria-hidden="true" />

      <!-- User / Logout buttons -->
      <div class="hidden items-center gap-1 md:flex">
        <Button
          variant="ghost"
          size="icon"
          class="text-muted-foreground hover:text-foreground"
          aria-label="User profile"
        >
          <User class="size-5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          class="text-muted-foreground hover:text-destructive"
          aria-label="Logout"
          @click="handleLogout"
        >
          <LogOut class="size-5" />
        </Button>
      </div>
    </div>
  </header>
</template>