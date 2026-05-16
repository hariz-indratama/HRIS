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
import { useStatusStyles } from '@/composables/useStatusStyles'
import SkeletonCard from '@/components/shared/SkeletonCard.vue'

const activeFilter = ref('semua')

const filters = [
  { key: 'semua', label: 'Semua' },
  { key: 'hadir', label: 'Hadir' },
  { key: 'terlambat', label: 'Terlambat' },
  { key: 'izin', label: 'Izin' },
  { key: 'wfh', label: 'WFH' },
]

const attendanceStore = useAttendanceStore()
const statusStyles = useStatusStyles()

const statusClassMap: Record<string, { bg: string; text: string; border: string }> = {
  on_time:  statusStyles.success,
  late:     statusStyles.warning,
  absent:   statusStyles.error,
  pending:  statusStyles.warning,
  approved: statusStyles.success,
  rejected: statusStyles.error,
}

const dotClassMap: Record<string, string> = {
  on_time: 'bg-primary',
  late: 'bg-warning',
  absent: 'bg-destructive',
  pending: 'bg-amber-400',  // literal: pending status dot — replace after token expansion
  approved: 'bg-success',
  rejected: 'bg-destructive',
}

const attendanceRecords = computed(() =>
  attendanceStore.attendanceHistory.map((record) => {
    const date = new Date(record.date)
    const dateLabel = date.toLocaleDateString('id-ID', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    })
    const classes = statusClassMap[record.status] ?? statusStyles.neutral
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
      bgClass: classes.bg,
      textClass: classes.text,
      borderClass: classes.border,
      dotClass: dotClassMap[record.status] ?? 'bg-border',
      note: record.notes,
    }
  }),
)

const hasRecords = computed(() => attendanceStore.attendanceHistory.length > 0)
const hasError = computed(() => attendanceStore.error !== null)

/**
 * Filter the attendance history by status.
 *
 * @remarks
 * Backend support:
 * - 'hadir' → 'on_time' ✅ (backend supported)
 * - 'terlambat' → 'late' ✅ (backend supported)
 * - 'semua' → no filter ✅ (backend supported)
 *
 * Backend NOT yet supported:
 * - 'izin' → no filter applied (backend does not return leave-linked attendance)
 * - 'wfh' → no filter applied (WFH is not a attendance status)
 *
 * The 'izin' and 'wfh' filters currently fall back to 'semua' behavior
 * until the backend adds attendance-leave join logic.
 */
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
      <span class="text-base font-semibold text-foreground">Riwayat Presensi</span>
    </template>
    <template #actions>
      <button
        class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted/50 transition-colors"
        aria-label="Calendar filter"
      >
        <CalendarDays class="w-5 h-5 text-foreground" />
      </button>
    </template>

    <!-- ── Error Banner ──────────────────────────────── -->
    <div
      v-if="hasError"
      class="mb-4 flex items-center justify-between p-3 rounded-xl"
      :class="[statusStyles.error.bg, statusStyles.error.border]"
    >
      <span class="text-sm" :class="statusStyles.error.text">
        {{ attendanceStore.error }}
      </span>
      <button
        class="px-3 py-1.5 rounded-full text-xs font-medium border"
        :class="[statusStyles.error.border, statusStyles.error.text]"
        @click="attendanceStore.fetchHistory()"
      >
        Ulangi
      </button>
    </div>

    <!-- ── Filter Chips ──────────────────────────────── -->
    <nav class="flex overflow-x-auto gap-2 mb-4 pb-1 -mx-1 px-1 no-scrollbar">
      <button
        v-for="f in filters"
        :key="f.key"
        class="whitespace-nowrap px-4 h-11 flex items-center justify-center rounded-full text-xs font-medium transition-all active:scale-95"
        :class="
          activeFilter === f.key
            ? 'bg-primary text-primary shadow-sm'
            : 'bg-muted border border-border text-foreground-variant hover:bg-muted/50'
        "
        @click="handleFilterClick(f.key)"
      >
        {{ f.label }}
      </button>
    </nav>

    <!-- ── Timeline ──────────────────────────────────── -->
    <section class="space-y-4">
      <!-- Loading state -->
      <template v-if="attendanceStore.isLoading">
        <div class="space-y-4">
          <SkeletonCard v-for="i in 5" :key="i" :lines="3" />
        </div>
      </template>

      <template v-else-if="hasRecords">
        <div
          v-for="(record, idx) in attendanceRecords"
          :key="idx"
          class="relative flex items-start gap-3"
          :class="idx < attendanceRecords.length - 1 ? 'pb-4' : ''"
        >
          <!-- Thread line -->
          <div
            v-if="idx < attendanceRecords.length - 1"
            class="absolute left-2.5 top-8 bottom-0 w-0.5 bg-border-variant"
          />

          <!-- Dot -->
          <div
            class="relative z-10 mt-1.5 h-6 w-6 rounded-full flex items-center justify-center border-2 border-white"
            :class="record.dotClass"
          >
            <div class="h-1.5 w-1.5 rounded-full bg-card" />
          </div>

          <!-- Card -->
          <div class="flex-1 bg-card border border-border rounded-xl p-3 shadow-sm">
            <div class="flex justify-between items-start mb-2">
              <h3 class="text-sm font-semibold text-foreground">{{ record.date }}</h3>
              <span
                class="px-2.5 py-0.5 rounded-full text-xs font-medium border"
                :class="[record.bgClass, record.textClass, record.borderClass].join(' ')"
              >
                {{ record.statusLabel }}
              </span>
            </div>

            <!-- Times -->
            <div class="space-y-1">
              <div class="flex items-center gap-2 text-xs text-foreground-variant">
                <Clock class="w-3.5 h-3.5" />
                <span>
                  Masuk:
                  <span class="font-semibold text-foreground">
                    {{ record.clockIn ?? '—' }}
                  </span>
                </span>
              </div>
              <div class="flex items-center gap-2 text-xs text-foreground-variant">
                <LogOut class="w-3.5 h-3.5" />
                <span>
                  Keluar:
                  <span class="font-semibold text-foreground">
                    {{ record.clockOut ?? '—' }}
                  </span>
                </span>
              </div>
              <div
                v-if="record.note"
                class="flex items-center gap-2 text-xs text-foreground-variant italic"
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
        <div class="w-48 h-48 mb-4 rounded-2xl overflow-hidden bg-muted-low flex items-center justify-center">
          <CalendarDays class="w-16 h-16 text-border opacity-50" />
        </div>
        <h4 class="text-base font-semibold text-foreground-variant">Belum ada data absensi</h4>
        <p class="text-xs text-border px-8 mt-1">
          Data riwayat untuk filter ini akan muncul di sini setelah Anda melakukan presensi.
        </p>
      </div>
    </section>
  </AppPwaLayout>
</template>
