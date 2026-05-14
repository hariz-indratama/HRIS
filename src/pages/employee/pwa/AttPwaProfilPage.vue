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
import { useAuthStore } from '@/stores/authStore'
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

const employee = {
  name: 'Ahmad Rizki Pratama',
  empId: '#EMP-2024-0042',
  department: 'Engineering',
  role: 'Staff',
  email: 'ahmad.rizki@company.com',
  phone: '+62 812-3456-7890',
  joinDate: '12 Jan 2024',
  division: 'Core Engineering',
  shift: 'Regular — 08:00 – 17:00',
  location: 'Jakarta HQ',
}

const quickStats = [
  { label: 'Cuti Tersisa', value: '12', unit: 'hari' },
  { label: 'Izin Bulan Ini', value: '2', unit: '' },
  { label: 'Total Hadir', value: '95', unit: '%' },
]

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
      <span class="text-base font-semibold text-stitch-primary">Profil Saya</span>
    </template>

    <!-- ── Profile Hero Card ──────────────────────────── -->
    <section class="bg-white rounded-xl border border-stitch-outline-variant shadow-sm p-4 mb-4 text-center">
      <!-- Avatar -->
      <div class="mb-3 flex justify-center">
        <div class="relative">
          <img
            :alt="employee.name"
            class="w-20 h-20 rounded-full object-cover border-4 border-stitch-primary-container"
            src="https://i.pravatar.cc/96?img=11"
          />
          <div
            class="absolute -bottom-1 -right-1 h-6 w-6 bg-stitch-success rounded-full border-2 border-white"
          />
        </div>
      </div>
      <h2 class="text-lg font-bold text-stitch-on-surface">{{ employee.name }}</h2>
      <div class="flex items-center justify-center gap-2 mt-1">
        <span class="px-2.5 py-0.5 rounded-full bg-stitch-primary-container text-stitch-on-primary-container text-xs font-medium">
          {{ employee.empId }}
        </span>
        <span class="px-2.5 py-0.5 rounded-full bg-stitch-surface-container text-stitch-on-surface-variant text-xs font-medium border border-stitch-outline-variant">
          {{ employee.department }}
        </span>
        <span class="px-2.5 py-0.5 rounded-full bg-stitch-surface-container text-stitch-secondary text-xs font-medium border border-stitch-outline-variant">
          {{ employee.role }}
        </span>
      </div>
    </section>

    <!-- ── Info Rows ──────────────────────────────────── -->
    <section class="bg-white rounded-xl border border-stitch-outline-variant shadow-sm overflow-hidden mb-4">
      <!-- Personal -->
      <div class="p-3 border-b border-stitch-outline-variant">
        <p class="text-[10px] uppercase tracking-wider text-stitch-on-surface-variant mb-2 font-medium">Informasi Pribadi</p>
        <div class="space-y-2">
          <div class="flex items-center gap-3">
            <Mail class="w-4 h-4 text-stitch-outline flex-shrink-0" />
            <div class="flex-1 min-w-0">
              <p class="text-[10px] text-stitch-outline mb-0.5">Email</p>
              <p class="text-sm text-stitch-on-surface truncate">{{ employee.email }}</p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <Phone class="w-4 h-4 text-stitch-outline flex-shrink-0" />
            <div class="flex-1">
              <p class="text-[10px] text-stitch-outline mb-0.5">Telepon</p>
              <p class="text-sm text-stitch-on-surface">{{ employee.phone }}</p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <Calendar class="w-4 h-4 text-stitch-outline flex-shrink-0" />
            <div class="flex-1">
              <p class="text-[10px] text-stitch-outline mb-0.5">Tanggal Bergabung</p>
              <p class="text-sm text-stitch-on-surface">{{ employee.joinDate }}</p>
            </div>
          </div>
        </div>
      </div>
      <!-- Work -->
      <div class="p-3">
        <p class="text-[10px] uppercase tracking-wider text-stitch-on-surface-variant mb-2 font-medium">Informasi Kerja</p>
        <div class="space-y-2">
          <div class="flex items-center gap-3">
            <Building2 class="w-4 h-4 text-stitch-outline flex-shrink-0" />
            <div class="flex-1">
              <p class="text-[10px] text-stitch-outline mb-0.5">Divisi</p>
              <p class="text-sm text-stitch-on-surface">{{ employee.division }}</p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <Clock class="w-4 h-4 text-stitch-outline flex-shrink-0" />
            <div class="flex-1">
              <p class="text-[10px] text-stitch-outline mb-0.5">Jadwal Shift</p>
              <p class="text-sm text-stitch-on-surface">{{ employee.shift }}</p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <MapPin class="w-4 h-4 text-stitch-outline flex-shrink-0" />
            <div class="flex-1">
              <p class="text-[10px] text-stitch-outline mb-0.5">Lokasi Kantor</p>
              <p class="text-sm text-stitch-on-surface">{{ employee.location }}</p>
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
        class="bg-white rounded-xl border border-stitch-outline-variant p-3 text-center shadow-sm"
      >
        <p class="text-[10px] text-stitch-on-surface-variant mb-1">{{ stat.label }}</p>
        <p class="text-lg font-bold text-stitch-primary leading-none">
          {{ stat.value }}<span class="text-xs font-normal text-stitch-secondary ml-0.5">{{ stat.unit }}</span>
        </p>
      </div>
    </section>

    <!-- ── Menu Items ─────────────────────────────────── -->
    <section class="bg-white rounded-xl border border-stitch-outline-variant shadow-sm overflow-hidden mb-4 divide-y divide-stitch-outline-variant">
      <button
        v-for="item in menuItems"
        :key="item.label"
        class="w-full flex items-center gap-3 p-3 hover:bg-stitch-surface-container transition-colors"
      >
        <component :is="item.icon" class="w-5 h-5 text-stitch-secondary flex-shrink-0" />
        <span class="flex-1 text-left text-sm text-stitch-on-surface">{{ item.label }}</span>
        <ChevronRight class="w-4 h-4 text-stitch-outline" />
      </button>
    </section>

    <!-- ── Logout ─────────────────────────────────────── -->
    <button
      class="w-full h-12 border border-stitch-error text-stitch-error rounded-full text-sm font-medium hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
      @click="handleLogout"
    >
      <LogOut class="w-4 h-4" />
      Keluar / Logout
    </button>
  </AppPwaLayout>
</template>
