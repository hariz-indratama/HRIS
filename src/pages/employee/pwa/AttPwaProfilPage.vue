<script setup lang="ts">
/**
 * AttPwaProfilPage.vue
 *
 * Employee PWA — Profile / Profil screen.
 * Displays user info, work details, quick stats, and logout.
 *
 * @packageDocumentation
 */
import { useRouter } from 'vue-router'
import { computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useLeaveStore } from '@/stores/leaveStore'
import { useStatusStyles } from '@/composables/useStatusStyles'
import {
  Settings,
  Bell,
  HelpCircle,
  LogOut,
  ChevronRight,
  Mail,
  Phone,
  Calendar,
  Building2,
  Clock,
  MapPin,
} from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()
const leaveStore = useLeaveStore()
const statusStyles = useStatusStyles()

// ── Profile computed ────────────────────────────────────────────
const profile = computed(() => {
  const u = authStore.user
  if (!u) return null
  return {
    name: u.name,
    email: u.email,
    department: u.department ?? '-',
    position: u.position ?? '-',
    phone: u.phone ?? '-',
    avatarUrl: u.avatarUrl ?? 'https://i.pravatar.cc/96?img=11',
  }
})

// ── Quick stats from leaveStore ────────────────────────────────
const quickStats = computed(() => [
  { label: 'Cuti Tersisa', value: leaveStore.vacationBalance, unit: 'hari' },
  { label: 'Izin Bulan Ini', value: leaveStore.pendingCount, unit: '' },
  { label: 'Total Hadir', value: '—', unit: '%' },
])

// ── Fetch on mount ─────────────────────────────────────────────
onMounted(async () => {
  if (authStore.user) {
    await authStore.fetchUser()
  }
  await leaveStore.fetchBalance()
})

const menuItems = [
  { icon: Settings, label: 'Pengaturan Akun' },
  { icon: Bell, label: 'Notifikasi' },
  { icon: HelpCircle, label: 'Bantuan & Dukungan' },
]

function handleLogout(): void {
  authStore.clearAuth()
  router.push('/auth/login')
}
</script>

<template>
  <AppPwaLayout>
    <template #title>
      <span class="text-base font-semibold text-foreground">Profil Saya</span>
    </template>

    <!-- ── Profile Hero Card ──────────────────────────── -->
    <section class="bg-card rounded-xl border border-border shadow-sm p-4 mb-4 text-center">
      <!-- Avatar -->
      <div class="mb-3 flex justify-center">
        <div class="relative">
          <img
            :alt="profile?.name"
            class="w-20 h-20 rounded-full object-cover border-4 border-primary/20"
            :src="profile?.avatarUrl ?? 'https://i.pravatar.cc/96?img=11'"
          />
          <div
            class="absolute -bottom-1 -right-1 h-6 w-6 bg-success rounded-full border-2 border-white"
          />
        </div>
      </div>
      <h2 class="text-lg font-bold text-foreground">{{ profile?.name }}</h2>
      <div class="flex items-center justify-center gap-2 mt-1">
        <span class="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
          #EMP-{{ authStore.user?.id ?? '—' }}
        </span>
        <span class="px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground text-xs font-medium border border-border">
          {{ profile?.department }}
        </span>
        <span class="px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground text-xs font-medium border border-border">
          {{ authStore.user?.role ?? '—' }}
        </span>
      </div>
    </section>

    <!-- ── Info Rows ──────────────────────────────────── -->
    <section class="bg-card rounded-xl border border-border shadow-sm overflow-hidden mb-4">
      <!-- Personal -->
      <div class="p-3 border-b border-border">
        <p class="text-[10px] uppercase tracking-wider text-muted-foreground mb-2 font-medium">Informasi Pribadi</p>
        <div class="space-y-2">
          <div class="flex items-center gap-3">
            <Mail class="w-4 h-4 text-border flex-shrink-0" />
            <div class="flex-1 min-w-0">
              <p class="text-[10px] text-border mb-0.5">Email</p>
              <p class="text-sm text-foreground truncate">{{ profile?.email }}</p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <Phone class="w-4 h-4 text-border flex-shrink-0" />
            <div class="flex-1">
              <p class="text-[10px] text-border mb-0.5">Telepon</p>
              <p class="text-sm text-foreground">{{ profile?.phone }}</p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <Calendar class="w-4 h-4 text-border flex-shrink-0" />
            <div class="flex-1">
              <p class="text-[10px] text-border mb-0.5">Tanggal Bergabung</p>
              <p class="text-sm text-foreground">{{ authStore.user?.createdAt ? new Date(authStore.user.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '—' }}</p>
            </div>
          </div>
        </div>
      </div>
      <!-- Work -->
      <div class="p-3">
        <p class="text-[10px] uppercase tracking-wider text-muted-foreground mb-2 font-medium">Informasi Kerja</p>
        <div class="space-y-2">
          <div class="flex items-center gap-3">
            <Building2 class="w-4 h-4 text-border flex-shrink-0" />
            <div class="flex-1">
              <p class="text-[10px] text-border mb-0.5">Divisi</p>
              <p class="text-sm text-foreground">{{ profile?.position }}</p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <Clock class="w-4 h-4 text-border flex-shrink-0" />
            <div class="flex-1">
              <p class="text-[10px] text-border mb-0.5">Jadwal Shift</p>
              <p class="text-sm text-foreground">Regular — 08:00 – 17:00</p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <MapPin class="w-4 h-4 text-border flex-shrink-0" />
            <div class="flex-1">
              <p class="text-[10px] text-border mb-0.5">Lokasi Kantor</p>
              <p class="text-sm text-foreground">{{ profile?.department ?? '—' }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── Quick Stats ────────────────────────────────── -->
    <section class="grid grid-cols-3 gap-2 mb-4">
      <div
        v-for="stat in quickStats"
        :key="stat.label"
        class="bg-card rounded-xl border border-border p-3 text-center shadow-sm"
      >
        <p class="text-[10px] text-muted-foreground mb-1">{{ stat.label }}</p>
        <p class="text-lg font-bold text-foreground leading-none">
          {{ stat.value }}<span class="text-xs font-normal text-muted-foreground ml-0.5">{{ stat.unit }}</span>
        </p>
      </div>
    </section>

    <!-- ── Menu Items ─────────────────────────────────── -->
    <section class="bg-card rounded-xl border border-border shadow-sm overflow-hidden mb-4 divide-y divide-border">
      <button
        v-for="item in menuItems"
        :key="item.label"
        class="w-full flex items-center gap-3 p-3 hover:bg-muted transition-colors"
      >
        <component :is="item.icon" class="w-5 h-5 text-muted-foreground flex-shrink-0" />
        <span class="flex-1 text-left text-sm text-foreground">{{ item.label }}</span>
        <ChevronRight class="w-4 h-4 text-border" />
      </button>
    </section>

    <!-- ── Logout ─────────────────────────────────────── -->
    <button
      class="w-full h-12 border rounded-full text-sm font-medium flex items-center justify-center gap-2 transition-colors hover:opacity-90"
      :class="[statusStyles.error.bg, statusStyles.error.text, statusStyles.error.border].join(' ')"
      @click="handleLogout"
    >
      <LogOut class="w-4 h-4" />
      Keluar / Logout
    </button>
  </AppPwaLayout>
</template>
