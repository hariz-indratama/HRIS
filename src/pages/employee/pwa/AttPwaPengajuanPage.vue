<script setup lang="ts">
/**
 * AttPwaPengajuanPage.vue
 *
 * Employee PWA — Requests Hub / Pengajuan screen.
 * Quick stats + 2x2 request type selector + recent requests list.
 *
 * @packageDocumentation
 */
import { computed, onMounted } from 'vue'
import {
  Bell,
  Stethoscope,
  Clock,
  Palmtree,
  FileText,
  ChevronRight,
} from 'lucide-vue-next'
import { useLeaveStore } from '@/stores/leaveStore'

const leaveStore = useLeaveStore()

// ── Stats (from store) ─────────────────────────────────────────
// accent format: "text-X bg-X border-X"
const toColorClass = (accent: string) =>
  accent.split(' ').slice(0, 2).join(' ') // e.g. "text-green-600 bg-green-50"
const toBorderClass = (accent: string) =>
  accent.split(' ')[2] ?? 'border-stitch-outline-variant' // e.g. "border-green-200"

const stats = computed(() => [
  {
    icon: Palmtree,
    label: 'Cuti Tahunan',
    value: `${leaveStore.vacationBalance} hari`,
    colorClass: toColorClass('text-green-600 bg-green-50'),
    borderClass: toBorderClass('text-green-600 bg-green-50 border-green-200'),
  },
  {
    icon: Stethoscope,
    label: 'Izin Sakit',
    value: `${leaveStore.sickBalance} hari`,
    colorClass: toColorClass('text-green-600 bg-green-50'),
    borderClass: toBorderClass('text-green-600 bg-green-50 border-green-200'),
  },
  {
    icon: Clock,
    label: 'Lembur',
    value: leaveStore.overtimeRemaining > 0 ? `${leaveStore.overtimeRemaining} jam tersisa` : 'Habis',
    colorClass: toColorClass('text-amber-600 bg-amber-50'),
    borderClass: toBorderClass('text-amber-600 bg-amber-50 border-amber-200'),
  },
  {
    icon: FileText,
    label: 'Izin Pribadi',
    value: `${leaveStore.personalBalance} hari`,
    colorClass: toColorClass('text-stitch-secondary bg-stitch-surface-container'),
    borderClass: toBorderClass('text-stitch-secondary bg-stitch-surface-container border-stitch-outline-variant'),
  },
])

// Fetch balance & requests on mount
onMounted(async () => {
  await Promise.all([
    leaveStore.fetchBalance(),
    leaveStore.fetchMyRequests(),
    leaveStore.fetchOvertimeSummary(),
  ])
})

const requestTypes = [
  {
    icon: Stethoscope,
    title: 'Izin Sakit',
    subtitle: 'Kirim surat dokter',
    colorClass: 'bg-green-50 text-green-600',
    borderClass: 'border-green-200',
    to: '/pwa/pengajuan/izin-sakit',
  },
  {
    icon: Clock,
    title: 'Lembur',
    subtitle: 'Pengajuan jam lembur',
    colorClass: 'bg-amber-50 text-amber-600',
    borderClass: 'border-amber-200',
    to: '/pwa/pengajuan/lembur',
  },
  {
    icon: Palmtree,
    title: 'Cuti Tahunan',
    subtitle: 'Cuti reguler & besar',
    colorClass: 'bg-stitch-secondary-container text-stitch-primary',
    borderClass: 'border-stitch-outline-variant',
    to: '/pwa/pengajuan/cuti',
  },
  {
    icon: FileText,
    title: 'Izin',
    subtitle: 'Izin tidak masuk',
    colorClass: 'bg-stitch-surface-container text-stitch-secondary',
    borderClass: 'border-stitch-outline-variant',
    to: '/pwa/pengajuan/izin',
  },
]

// ── Recent Requests (from store) ──────────────────────────────
const typeLabel: Record<string, string> = {
  sick: 'Izin Sakit',
  vacation: 'Cuti Tahunan',
  personal: 'Izin Pribadi',
  overtime: 'Lembur',
}
const statusLabel: Record<string, string> = {
  pending: 'Menunggu',
  approved: 'Disetujui',
  rejected: 'Ditolak',
}

const recentRequests = computed(() =>
  leaveStore.recentRequests.map((req) => ({
    type: typeLabel[req.type] ?? req.type,
    date: new Date(req.createdAt).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }),
    status: req.status,
    statusLabel: statusLabel[req.status] ?? req.status,
  })),
)

function statusStyle(status: string): string {
  if (status === 'approved') return 'bg-green-50 text-green-700'
  if (status === 'rejected') return 'bg-red-50 text-stitch-error'
  return 'bg-amber-50 text-amber-600'
}
</script>

<template>
  <AppPwaLayout>
    <template #title>
      <span class="text-base font-semibold text-stitch-primary">Pengajuan</span>
    </template>
    <template #actions>
      <button
        class="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-stitch-surface-container-high transition-colors"
        aria-label="Notifications"
      >
        <Bell class="w-5 h-5 text-stitch-primary" />
        <span class="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-stitch-error" />
      </button>
    </template>

    <!-- ── Quick Stats ───────────────────────────────── -->
    <section class="grid grid-cols-2 gap-2 mb-4">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="bg-white rounded-xl border p-3 shadow-sm flex items-center gap-2.5"
        :class="stat.borderClass"
      >
        <div
          class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
          :class="stat.colorClass"
        >
          <component :is="stat.icon" class="w-5 h-5" />
        </div>
        <div>
          <p class="text-[10px] uppercase tracking-wide text-stitch-on-surface-variant">{{ stat.label }}</p>
          <p class="text-sm font-bold text-stitch-on-surface leading-none mt-0.5">{{ stat.value }}</p>
        </div>
      </div>
    </section>

    <!-- ── Request Type Selector ──────────────────────── -->
    <section class="grid grid-cols-2 gap-2 mb-4">
      <RouterLink
        v-for="card in requestTypes"
        :key="card.title"
        :to="card.to"
        class="bg-white rounded-xl border border-stitch-outline-variant shadow-sm p-3 flex items-start gap-2.5 hover:shadow-md transition-shadow"
      >
        <div
          class="w-10 h-10 rounded-xl flex items-center justify-center border flex-shrink-0"
          :class="card.colorClass"
        >
          <component :is="card.icon" class="w-5 h-5" />
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-xs font-semibold text-stitch-on-surface leading-tight">{{ card.title }}</p>
          <p class="text-[10px] text-stitch-on-surface-variant mt-0.5 leading-tight">{{ card.subtitle }}</p>
        </div>
        <ChevronRight class="w-4 h-4 text-stitch-outline flex-shrink-0 mt-1" />
      </RouterLink>
    </section>

    <!-- ── Recent Requests ────────────────────────────── -->
    <section>
      <div class="flex justify-between items-center mb-2 px-1">
        <h3 class="text-sm font-semibold text-stitch-on-surface">Pengajuan Terkini</h3>
        <button class="text-xs text-stitch-primary font-medium">Lihat Semua</button>
      </div>
      <div class="bg-white rounded-xl border border-stitch-outline-variant shadow-sm overflow-hidden divide-y divide-stitch-outline-variant">
        <div
          v-for="req in recentRequests"
          :key="req.type + req.date"
          class="flex items-center gap-3 p-3"
        >
          <div class="flex-1">
            <p class="text-sm font-medium text-stitch-on-surface">{{ req.type }}</p>
            <p class="text-xs text-stitch-on-surface-variant">{{ req.date }}</p>
          </div>
          <span
            class="px-2.5 py-0.5 rounded-full text-xs font-medium border"
            :class="statusStyle(req.status)"
          >
            {{ req.statusLabel }}
          </span>
        </div>
      </div>
    </section>
  </AppPwaLayout>
</template>
