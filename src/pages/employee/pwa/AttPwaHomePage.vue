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

const attendanceStore = useAttendanceStore()
const leaveStore = useLeaveStore()
const authStore = useAuthStore()

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
    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 10000,
      })
    })
    const deviceId =
      'pwa-' +
      (await navigator.clipboard.readText().catch(() =>
        Math.random().toString(36).slice(2),
      ))
    await attendanceStore.clockIn(
      position.coords.latitude,
      position.coords.longitude,
      deviceId,
    )
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Gagal clock-in'
    alert(msg)
  }
}

async function handleClockOut(): Promise<void> {
  if (!attendanceStore.todayAttendance) return
  try {
    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 10000,
      })
    })
    await attendanceStore.clockOut(
      position.coords.latitude,
      position.coords.longitude,
      attendanceStore.todayAttendance.id,
    )
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Gagal clock-out'
    alert(msg)
  }
}
</script>

<template>
  <AppPwaLayout>
    <template #title>
      <span class="text-base font-semibold text-stitch-primary font-sans">Attendance Pro</span>
    </template>

    <!-- ── Greeting ──────────────────────────────────────── -->
    <div class="flex justify-between items-start mb-4">
      <div>
        <h1 class="text-xl font-semibold text-stitch-primary leading-tight">
          Selamat Pagi
        </h1>
        <p class="text-sm font-medium text-stitch-secondary mt-0.5">
          {{ authStore.user?.name ?? 'Karyawan' }}
        </p>
      </div>

      <!-- Avatar -->
      <div
        class="h-12 w-12 rounded-full overflow-hidden border-2 border-stitch-outline-variant bg-stitch-surface-container"
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
            ? 'bg-green-50 text-green-700 border-green-200'
            : 'bg-stitch-surface-container text-stitch-on-surface-variant border-stitch-outline-variant'
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
      class="bg-white rounded-xl p-4 shadow-sm border border-stitch-outline-variant mb-4 text-center flex flex-col items-center"
    >
      <!-- Time + Date -->
      <div class="mb-3">
        <p class="text-[48px] font-bold tracking-tight text-stitch-primary leading-none">
          {{ currentTime }}
        </p>
        <p class="text-sm text-stitch-secondary mt-1">
          {{ currentDate }}
        </p>
      </div>

      <!-- Geofence Badge -->
      <div
        class="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-50 border border-green-200"
      >
        <MapPin class="w-3.5 h-3.5 text-green-600" />
        <span class="text-xs font-semibold text-green-700">Dalam Jangkauan</span>
      </div>

      <!-- Map Placeholder -->
      <div
        class="mt-4 w-full h-28 rounded-lg overflow-hidden bg-stitch-surface-variant relative"
      >
        <div class="absolute inset-0 flex items-center justify-center">
          <div
            class="h-8 w-8 bg-stitch-primary rounded-full flex items-center justify-center border-4 border-white shadow-lg"
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
        :class="isClockedIn ? 'bg-green-600 hover:bg-green-700' : 'bg-stitch-primary hover:bg-stitch-primary-container'"
        @click="isClockedIn ? handleClockOut() : handleClockIn()"
      >
        <component :is="isClockedIn ? LogOut : LogIn" class="w-5 h-5" />
        {{ isClockedIn ? 'Clock Out' : 'Clock In' }}
      </button>
    </div>

    <!-- ── Monthly Summary ──────────────────────────────── -->
    <section>
      <h3 class="text-xs font-medium text-stitch-secondary mb-3 px-1 uppercase tracking-wider">
        Ringkasan Bulan Ini
      </h3>
      <div class="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
        <!-- Hadir -->
        <div
          class="flex-shrink-0 px-4 py-3 rounded-xl bg-stitch-surface-container-high border border-stitch-outline-variant flex flex-col gap-1 min-w-[110px]"
        >
          <span class="text-xs text-stitch-secondary">Hadir</span>
          <span class="text-lg font-semibold text-stitch-primary">{{ attendanceStore.attendanceHistory.length }}</span>
        </div>
        <!-- Terlambat -->
        <div
          class="flex-shrink-0 px-4 py-3 rounded-xl bg-stitch-surface-container-high border border-stitch-outline-variant flex flex-col gap-1 min-w-[110px]"
        >
          <span class="text-xs text-stitch-secondary">Terlambat</span>
          <span class="text-lg font-semibold text-stitch-tertiary-container">
          {{ attendanceStore.attendanceHistory.filter(r => r.status === 'late').length }}
        </span>
        </div>
        <!-- Izin -->
        <div
          class="flex-shrink-0 px-4 py-3 rounded-xl bg-stitch-surface-container-high border border-stitch-outline-variant flex flex-col gap-1 min-w-[110px]"
        >
          <span class="text-xs text-stitch-secondary">Izin</span>
          <span class="text-lg font-semibold text-stitch-secondary">{{ leaveStore.pendingCount }}</span>
        </div>
      </div>
    </section>
  </AppPwaLayout>
</template>
