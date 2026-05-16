<script setup lang="ts">
/**
 * AttPwaHomePage.vue
 *
 * Employee PWA — Home / Clock In-Out screen.
 * Displays a live clock, geofence status, Clock In/Out CTA, and monthly summary stats.
 *
 * @packageDocumentation
 */
import { ref, computed, onMounted, onUnmounted } from 'vue'
import {
  MapPin,
  LogIn,
  LogOut,
} from 'lucide-vue-next'
import { useAttendanceStore } from '@/stores/attendanceStore'
import { useLeaveStore } from '@/stores/leaveStore'
import { useAuthStore } from '@/stores/authStore'
import { useGeolocation } from '@/composables/useGeolocation'
import { useStatusStyles } from '@/composables/useStatusStyles'
import { useToast } from '@/composables/useToast'
import SkeletonCard from '@/components/shared/SkeletonCard.vue'

const attendanceStore = useAttendanceStore()
const leaveStore = useLeaveStore()
const authStore = useAuthStore()
const geo = useGeolocation()
const statusStyles = useStatusStyles()
const toast = useToast()

const hasError = computed(() => attendanceStore.error !== null)

// ── CTA button class ────────────────────────────────────────
const ctaClass = computed(() =>
  isClockedIn.value
    ? 'bg-success hover:bg-success/80'
    : 'bg-primary hover:bg-primary/90',
)

// ── Live Clock ───────────────────────────────────────────────
const currentTime = ref('08:45:12')
const currentDate = ref('Rabu, 14 Mei 2026')

let clockInterval: ReturnType<typeof setInterval>

// ── Geofence State ───────────────────────────────────────────
// Geofence check (dev-friendly: always true until backend configures office location)

// ── Computed State ──────────────────────────────────────────
const isClockedIn = computed(() => attendanceStore.todayAttendance !== null)

function updateClock(): void {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
  currentDate.value = now.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// ── Helpers ────────────────────────────────────────────────
async function getDeviceId(): Promise<string> {
  let deviceId = localStorage.getItem('device_id')
  if (!deviceId) {
    deviceId = crypto.randomUUID()
    localStorage.setItem('device_id', deviceId)
  }
  return deviceId
}

onMounted(async () => {
  updateClock()
  clockInterval = setInterval(updateClock, 1000)
  await Promise.all([
    attendanceStore.fetchToday(),
    leaveStore.fetchBalance(),
    authStore.fetchUser(),
  ])
})

onUnmounted(() => {
  clearInterval(clockInterval)
})

// ── Actions ─────────────────────────────────────────────────
async function handleClockIn(): Promise<void> {
  try {
    const { latitude, longitude } = await geo.getCurrentPosition()
    const deviceId = await getDeviceId()
    await attendanceStore.clockIn(latitude, longitude, deviceId)
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Gagal clock-in'
    toast.error(msg)
  }
}

async function handleClockOut(): Promise<void> {
  if (!attendanceStore.todayAttendance) return
  try {
    const { latitude, longitude } = await geo.getCurrentPosition()
    await attendanceStore.clockOut(
      latitude,
      longitude,
      attendanceStore.todayAttendance.id,
    )
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Gagal clock-out'
    toast.error(msg)
  }
}
</script>

<template>
  <AppPwaLayout>
    <template #title>
      <span class="text-base font-semibold text-foreground font-sans">Attendance Pro</span>
    </template>

    <!-- ── Loading skeletons ──────────────────────────── -->
    <template v-if="attendanceStore.isLoading || leaveStore.isLoading">
      <SkeletonCard :lines="4" />
      <SkeletonCard :lines="3" class="mt-4" />
      <div class="mt-4 flex gap-2">
        <SkeletonCard :lines="1" class="min-w-[110px]" />
        <SkeletonCard :lines="1" class="min-w-[110px]" />
        <SkeletonCard :lines="1" class="min-w-[110px]" />
      </div>
    </template>

    <!-- ── Error banner ───────────────────────────────── -->
    <template v-else-if="hasError">
      <div
        class="mb-4 flex items-center justify-between p-3 rounded-xl"
        :class="[statusStyles.error.bg, statusStyles.error.border]"
      >
        <span class="text-sm" :class="statusStyles.error.text">
          {{ attendanceStore.error }}
        </span>
        <button
          class="px-3 py-1.5 rounded-full text-xs font-medium border"
          :class="[statusStyles.error.border, statusStyles.error.text]"
          @click="attendanceStore.fetchToday()"
        >
          Ulangi
        </button>
      </div>
    </template>

    <!-- ── Actual content ─────────────────────────────── -->
    <template v-else>
    <!-- ── Greeting ──────────────────────────────────────── -->
    <div class="flex justify-between items-start mb-4">
      <div>
        <h1 class="text-xl font-semibold text-foreground leading-tight">
          Selamat Pagi
        </h1>
        <p class="text-sm font-medium text-muted-foreground mt-0.5">
          {{ authStore.user?.name ?? 'Karyawan' }}
        </p>
      </div>

      <!-- Avatar -->
      <div
        class="h-12 w-12 rounded-full overflow-hidden border-2 border-border bg-muted"
      >
        <img
          alt="Employee avatar"
          class="h-full w-full object-cover"
          src="https://i.pravatar.cc/96?img=11"
        />
      </div>
    </div>

    <!-- ── Status Pill ──────────────────────────────────── -->
    <div class="mb-4">
      <span
        class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border"
        :class="
          isClockedIn
            ? [statusStyles.success.bg, statusStyles.success.text, statusStyles.success.border].join(' ')
            : [statusStyles.neutral.bg, statusStyles.neutral.text, statusStyles.neutral.border].join(' ')
        "
      >
        <span class="mr-1.5 text-[10px]">
          {{ isClockedIn ? '●' : '○' }}
        </span>
        {{ isClockedIn ? 'Clocked In' : 'Belum Absen' }}
      </span>
    </div>

    <!-- ── Clock Hero Card ─────────────────────────────── -->
    <section
      class="bg-card rounded-xl p-4 shadow-sm border border-border mb-4 text-center flex flex-col items-center"
    >
      <!-- Time + Date -->
      <div class="mb-3">
        <p class="text-[48px] font-bold tracking-tight text-foreground leading-none">
          {{ currentTime }}
        </p>
        <p class="text-sm text-muted-foreground mt-1">
          {{ currentDate }}
        </p>
      </div>

      <!-- Geofence Badge -->
      <span
        class="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full"
        :class="[statusStyles.success.bg, statusStyles.success.border].join(' ')"
      >
        <MapPin class="w-3.5 h-3.5" :class="statusStyles.success.text" />
        <span class="text-xs font-semibold" :class="statusStyles.success.text">Dalam Jangkauan</span>
      </span>

      <!-- Map Placeholder -->
      <div
        class="mt-4 w-full h-28 rounded-lg overflow-hidden bg-muted relative"
      >
        <div class="absolute inset-0 flex items-center justify-center">
          <div
            class="h-8 w-8 bg-primary rounded-full flex items-center justify-center border-4 border-white shadow-lg"
          >
            <MapPin class="w-3.5 h-3.5 text-white" />
          </div>
        </div>
      </div>
    </section>

    <!-- ── Clock In/Out CTA ────────────────────────────── -->
    <div class="mb-6">
      <button
        class="w-full h-14 rounded-full flex items-center justify-center gap-2 text-white font-bold text-base shadow-lg transition-transform active:scale-95"
        :class="ctaClass"
        @click="isClockedIn ? handleClockOut() : handleClockIn()"
      >
        <component :is="isClockedIn ? LogOut : LogIn" class="w-5 h-5" />
        {{ isClockedIn ? 'Clock Out' : 'Clock In' }}
      </button>
    </div>

    <!-- ── Monthly Summary ──────────────────────────────── -->
    <section>
      <h3 class="text-xs font-medium text-muted-foreground mb-3 px-1 uppercase tracking-wider">
        Ringkasan Bulan Ini
      </h3>
      <div class="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
        <!-- Hadir -->
        <div
          class="flex-shrink-0 px-4 py-3 rounded-xl bg-muted border border-border flex flex-col gap-1 min-w-[110px]"
        >
          <span class="text-xs text-muted-foreground">Hadir</span>
          <span class="text-lg font-semibold text-foreground">{{ attendanceStore.attendanceHistory.length }}</span>
        </div>
        <!-- Terlambat -->
        <div
          class="flex-shrink-0 px-4 py-3 rounded-xl bg-muted border border-border flex flex-col gap-1 min-w-[110px]"
        >
          <span class="text-xs text-muted-foreground">Terlambat</span>
          <span class="text-lg font-semibold text-warning">
          {{ attendanceStore.attendanceHistory.filter(r => r.status === 'late').length }}
        </span>
        </div>
        <!-- Izin -->
        <div
          class="flex-shrink-0 px-4 py-3 rounded-xl bg-muted border border-border flex flex-col gap-1 min-w-[110px]"
        >
          <span class="text-xs text-muted-foreground">Izin</span>
          <span class="text-lg font-semibold text-muted-foreground">{{ leaveStore.pendingCount }}</span>
        </div>
      </div>
    </section>
    </template>
  </AppPwaLayout>
</template>
