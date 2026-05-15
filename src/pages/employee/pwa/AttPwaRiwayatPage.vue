<script setup lang="ts">
/**
 * AttPwaRiwayatPage.vue
 *
 * Employee PWA — Attendance History / Riwayat screen.
 * Timeline list with filter chips and status badges.
 *
 * @packageDocumentation
 */
import { ref, computed, onMounted } from 'vue'
import { CalendarDays, Clock, LogOut, Info } from 'lucide-vue-next'
import { useAttendanceStore } from '@/stores/attendanceStore'

const activeFilter = ref('semua')

const filters = [
  { key: 'semua', label: 'Semua' },
  { key: 'hadir', label: 'Hadir' },
  { key: 'terlambat', label: 'Terlambat' },
  { key: 'izin', label: 'Izin' },
  { key: 'wfh', label: 'WFH' },
]

const attendanceStore = useAttendanceStore()

const statusClassMap: Record<string, string> = {
  on_time: 'bg-green-50 text-green-700 border-green-200',
  late: 'bg-amber-50 text-amber-700 border-amber-200',
  absent: 'bg-red-50 text-stitch-error border-red-200',
  pending: 'bg-amber-50 text-amber-600 border-amber-200',
  approved: 'bg-green-50 text-green-700 border-green-200',
  rejected: 'bg-red-50 text-stitch-error border-red-200',
}

const dotClassMap: Record<string, string> = {
  on_time: 'bg-stitch-primary',
  late: 'bg-stitch-tertiary-container',
  absent: 'bg-stitch-error',
  pending: 'bg-amber-400',
  approved: 'bg-stitch-success',
  rejected: 'bg-stitch-error',
}

const attendanceRecords = computed(() =>
  attendanceStore.attendanceHistory.map((record) => {
    const date = new Date(record.date)
    const dateLabel = date.toLocaleDateString('id-ID', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    })
    return {
      date: dateLabel,
      clockIn: record.clockIn,
      clockOut: record.clockOut,
      status: record.status,
      statusLabel: {
        on_time: 'Hadir',
        late: 'Terlambat',
        absent: 'Tidak Hadir',
      }[record.status] ?? record.status,
      statusClass: statusClassMap[record.status] ?? 'bg-stitch-surface-container',
      dotClass: dotClassMap[record.status] ?? 'bg-stitch-outline',
      note: record.notes,
    }
  }),
)

const hasRecords = computed(() => attendanceStore.attendanceHistory.length > 0)

async function applyFilter(filter: string): Promise<void> {
  activeFilter.value = filter
  const statusMap: Record<string, string | undefined> = {
    semua: undefined,
    hadir: 'on_time',
    terlambat: 'late',
    izin: undefined, // pending/izin statuses are not yet in attendanceHistory
    wfh: undefined,
  }
  await attendanceStore.fetchHistory(
    statusMap[filter] ? { status: statusMap[filter] as 'on_time' | 'late' | 'absent' } : {},
  )
}

function handleFilterClick(key: string): void {
  applyFilter(key)
}

onMounted(async () => {
  await attendanceStore.fetchHistory()
})
</script>

<template>
  <AppPwaLayout>
    <template #title>
      <span class="text-base font-semibold text-stitch-primary">Riwayat Presensi</span>
    </template>
    <template #actions>
      <button
        class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-stitch-surface-container-high transition-colors"
        aria-label="Calendar filter"
      >
        <CalendarDays class="w-5 h-5 text-stitch-primary" />
      </button>
    </template>

    <!-- ── Filter Chips ──────────────────────────────── -->
    <nav class="flex overflow-x-auto gap-2 mb-4 pb-1 -mx-1 px-1 no-scrollbar">
      <button
        v-for="f in filters"
        :key="f.key"
        class="whitespace-nowrap px-4 h-11 flex items-center justify-center rounded-full text-xs font-medium transition-all active:scale-95"
        :class="
          activeFilter === f.key
            ? 'bg-stitch-primary text-stitch-on-primary shadow-sm'
            : 'bg-stitch-surface-container border border-stitch-outline-variant text-stitch-on-surface-variant hover:bg-stitch-surface-container-high'
        "
        @click="handleFilterClick(f.key)"
      >
        {{ f.label }}
      </button>
    </nav>

    <!-- ── Timeline ──────────────────────────────────── -->
    <section class="space-y-4">
      <template v-if="hasRecords">
        <div
          v-for="(record, idx) in attendanceRecords"
          :key="idx"
          class="relative flex items-start gap-3"
          :class="idx < attendanceRecords.length - 1 ? 'pb-4' : ''"
        >
          <!-- Thread line -->
          <div
            v-if="idx < attendanceRecords.length - 1"
            class="absolute left-2.5 top-8 bottom-0 w-0.5 bg-stitch-outline-variant"
          />

          <!-- Dot -->
          <div
            class="relative z-10 mt-1.5 h-6 w-6 rounded-full flex items-center justify-center border-2 border-white"
            :class="record.dotClass"
          >
            <div class="h-1.5 w-1.5 rounded-full bg-white" />
          </div>

          <!-- Card -->
          <div class="flex-1 bg-white border border-stitch-outline-variant rounded-xl p-3 shadow-sm">
            <div class="flex justify-between items-start mb-2">
              <h3 class="text-sm font-semibold text-stitch-on-surface">{{ record.date }}</h3>
              <span
                class="px-2.5 py-0.5 rounded-full text-xs font-medium border"
                :class="record.statusClass"
              >
                {{ record.statusLabel }}
              </span>
            </div>

            <!-- Times -->
            <div class="space-y-1">
              <div class="flex items-center gap-2 text-xs text-stitch-on-surface-variant">
                <Clock class="w-3.5 h-3.5" />
                <span>
                  Masuk:
                  <span class="font-semibold text-stitch-on-surface">
                    {{ record.clockIn ?? '—' }}
                  </span>
                </span>
              </div>
              <div class="flex items-center gap-2 text-xs text-stitch-on-surface-variant">
                <LogOut class="w-3.5 h-3.5" />
                <span>
                  Keluar:
                  <span class="font-semibold text-stitch-on-surface">
                    {{ record.clockOut ?? '—' }}
                  </span>
                </span>
              </div>
              <div
                v-if="record.note"
                class="flex items-center gap-2 text-xs text-stitch-on-surface-variant italic"
              >
                <Info class="w-3.5 h-3.5" />
                {{ record.note }}
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- Empty State -->
      <div
        v-else
        class="flex flex-col items-center justify-center text-center py-16"
      >
        <div class="w-48 h-48 mb-4 rounded-2xl overflow-hidden bg-stitch-surface-container-low flex items-center justify-center">
          <CalendarDays class="w-16 h-16 text-stitch-outline opacity-50" />
        </div>
        <h4 class="text-base font-semibold text-stitch-on-surface-variant">Belum ada data absensi</h4>
        <p class="text-xs text-stitch-outline px-8 mt-1">
          Data riwayat untuk filter ini akan muncul di sini setelah Anda melakukan presensi.
        </p>
      </div>
    </section>
  </AppPwaLayout>
</template>
