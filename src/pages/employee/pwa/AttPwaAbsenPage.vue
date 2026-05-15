<script setup lang="ts">
/**
 * AttPwaAbsenPage.vue
 *
 * Employee PWA — Biometric Scan / Absen screen.
 * Fingerprint scanner UI with verification status, Face ID and Manual fallback.
 *
 * @packageDocumentation
 */
import { ref, computed, onMounted } from 'vue'
import {
  Info,
  CheckCircle,
  MapPin,
  Fingerprint,
  Keyboard,
  AlertCircle,
  History,
  RefreshCw,
} from 'lucide-vue-next'
import { useAttendanceStore } from '@/stores/attendanceStore'
import { useAuthStore } from '@/stores/authStore'
import { useGeolocation } from '@/composables/useGeolocation'
import { useStatusStyles } from '@/composables/useStatusStyles'

const attendanceStore = useAttendanceStore()
const authStore = useAuthStore()
const geo = useGeolocation()
const statusStyles = useStatusStyles()

// ── State ──────────────────────────────────────────────────────
const isVerifying = ref(false)
const verifyError = ref<string | null>(null)

const employeeName = computed(() => authStore.user?.name ?? 'Karyawan')
const isVerified = computed(
  () => attendanceStore.todayAttendance?.clockIn != null,
)
const verifyTime = computed(() => attendanceStore.todayAttendance?.clockIn ?? '')
const isWithinGeofence = ref(true)

onMounted(async () => {
  await attendanceStore.fetchToday()
  if (isVerified.value) {
    isWithinGeofence.value = true
  }
})

// ── Actions ──────────────────────────────────────────────────────
async function simulateVerification(): Promise<void> {
  if (isVerifying.value) return
  isVerifying.value = true
  verifyError.value = null

  try {
    const { latitude, longitude } = await geo.getCurrentPosition()
    const deviceId = `pwa-${crypto.randomUUID()}`
    const success = await attendanceStore.clockIn(latitude, longitude, deviceId)

    if (!success) {
      verifyError.value = attendanceStore.error ?? 'Clock-in gagal'
    } else {
      isWithinGeofence.value = true
    }
  } catch (err: unknown) {
    verifyError.value = err instanceof Error ? err.message : 'Gagal clock-in'
  } finally {
    isVerifying.value = false
  }
}

function retry(): void {
  verifyError.value = null
  simulateVerification()
}

function handleFaceId(): void {
  alert('Face ID: Coming soon!')
}

function handleManual(): void {
  alert('Manual entry: Coming soon!')
}
</script>

<template>
  <AppPwaLayout>
    <template #title>
      <span class="text-base font-semibold text-stitch-primary">Absen</span>
    </template>
    <template #actions>
      <button
        class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-stitch-surface-container-high transition-colors"
        aria-label="Info"
      >
        <Info class="w-5 h-5 text-stitch-primary" />
      </button>
    </template>

    <!-- ── Scanner Section ──────────────────────────────── -->
    <section
      class="bg-white rounded-xl border border-stitch-outline-variant shadow-sm p-4 text-center mb-4"
    >
      <!-- Scanner Ring + Icon -->
      <div class="relative flex items-center justify-center mb-6">
        <!-- Spinning ring -->
        <div
          v-if="isVerifying"
          class="absolute animate-spin rounded-full border-4 border-stitch-primary border-t-transparent"
          style="width: 140px; height: 140px;"
        />
        <!-- Fingerprint circle -->
        <div
          class="w-32 h-32 rounded-full flex items-center justify-center transition-all"
          :class="isVerified ? statusStyles.success.bg : 'bg-stitch-primary-container'"
        >
          <CheckCircle
            v-if="isVerified"
            class="w-16 h-16" :class="statusStyles.success.text"
          />
          <svg
            v-else
            class="w-16 h-16 text-stitch-primary"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M17.81 4.3a8.13 8.13 0 0 0-2.34.37 7.2 7.2 0 0 0-4.32 4.82 7.07 7.07 0 0 0-5.54 6.9A5.06 5.06 0 0 0 7 21a5 5 0 0 0 5 3h4a5 5 0 0 0 5-3 5.06 5.06 0 0 0-.61-2.34 7.2 7.2 0 0 0 4.82-4.32 8.13 8.13 0 0 0 .59-2.54zm-1.53 8.9a6 6 0 1 1 0-12 6 6 0 0 1 0 12z"
            />
          </svg>
        </div>
      </div>

      <h2 class="text-base font-semibold text-stitch-on-surface mb-1">
        {{ isVerified ? 'Verifikasi Berhasil' : 'Letakkan jari pada sensor' }}
      </h2>
      <p class="text-sm italic text-stitch-on-surface-variant">
        {{ isVerified ? employeeName : isVerifying ? 'Memverifikasi...' : 'Menunggu verifikasi...' }}
      </p>

      <!-- Error Banner -->
      <div
        v-if="verifyError"
        class="mt-3 flex items-center justify-center gap-2 text-stitch-error text-sm"
      >
        <AlertCircle class="w-4 h-4" />
        <span>{{ verifyError }}</span>
        <button class="underline ml-1" @click="retry">
          <RefreshCw class="w-3.5 h-3.5 inline mr-0.5" />
          Ulangi
        </button>
      </div>

      <!-- Trigger (auto on mount or tap) -->
      <button
        v-if="!isVerified && !isVerifying"
        class="mt-4 mx-auto text-xs text-stitch-primary underline"
        @click="simulateVerification"
      >
        Tap to simulate scan
      </button>
    </section>

    <!-- ── Verification Result Card ────────────────────── -->
    <section
      v-if="isVerified"
      class="bg-white rounded-xl border border-stitch-outline-variant shadow-sm overflow-hidden mb-4"
    >
      <!-- Header -->
      <div
        class="p-3 flex items-center gap-3 border-b border-stitch-outline-variant"
        :class="[statusStyles.success.bg, statusStyles.success.text, statusStyles.success.border].join(' ')"
      >
        <div
          class="w-10 h-10 rounded-full flex items-center justify-center bg-stitch-success-container" :class="statusStyles.success.text"
        >
          <CheckCircle class="w-5 h-5" />
        </div>
        <div>
          <p class="text-xs font-medium" :class="statusStyles.success.text">Verifikasi Berhasil</p>
          <p class="text-sm font-semibold text-stitch-on-surface">{{ employeeName }}</p>
        </div>
      </div>
      <!-- Stats -->
      <div class="p-3 grid grid-cols-2 gap-3">
        <div>
          <p class="text-[10px] uppercase tracking-wide text-stitch-on-surface-variant mb-0.5">Waktu Terdeteksi</p>
          <p class="text-base font-semibold text-stitch-primary">{{ verifyTime }}</p>
        </div>
        <div class="flex flex-col items-end">
          <p class="text-[10px] uppercase tracking-wide text-stitch-on-surface-variant mb-1">Status Lokasi</p>
          <span
            class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
            :class="isWithinGeofence ? [statusStyles.success.bg, statusStyles.success.text].join(' ') : [statusStyles.error.bg, statusStyles.error.text].join(' ')"
          >
            <MapPin class="w-3 h-3" />
            {{ isWithinGeofence ? 'Dalam Jangkauan' : 'Di Luar Jangkauan' }}
          </span>
        </div>
      </div>
    </section>

    <!-- ── Fallback Actions ────────────────────────────── -->
    <section class="text-center space-y-3 mb-6">
      <p class="text-xs font-medium text-stitch-on-surface-variant">atau gunakan cara lain</p>
      <div class="flex gap-3 justify-center">
        <button
          class="flex-1 min-h-[44px] flex items-center justify-center gap-2 border border-stitch-outline text-stitch-primary rounded-full text-xs font-medium hover:bg-stitch-surface-container transition-colors"
          @click="handleFaceId"
        >
          <Fingerprint class="w-4 h-4" />
          Face ID
        </button>
        <button
          class="flex-1 min-h-[44px] flex items-center justify-center gap-2 border border-stitch-outline text-stitch-primary rounded-full text-xs font-medium hover:bg-stitch-surface-container transition-colors"
          @click="handleManual"
        >
          <Keyboard class="w-4 h-4" />
          Manual
        </button>
      </div>
      <button class="inline-block text-xs text-stitch-primary underline py-1 min-h-[44px]">
        Laporkan Masalah
      </button>
    </section>

    <!-- ── Recent Activity ─────────────────────────────── -->
    <section class="space-y-3">
      <h3 class="text-base font-semibold text-stitch-on-surface">Recent Activity</h3>
      <div class="space-y-2">
        <!-- Failed attempt -->
        <div class="flex items-center gap-3 p-3 bg-stitch-surface-container-low rounded-lg border border-stitch-outline-variant">
          <div class="w-8 h-8 rounded-full bg-stitch-surface-variant flex items-center justify-center">
            <History class="w-4 h-4 text-stitch-on-surface-variant" />
          </div>
          <div class="flex-1">
            <p class="text-sm text-stitch-on-surface">Clock-in attempt</p>
            <p class="text-xs text-stitch-on-surface-variant">Today at 08:30 AM</p>
          </div>
          <span class="text-xs font-medium text-stitch-error flex items-center gap-1">
            <AlertCircle class="w-3 h-3" /> Failed
          </span>
        </div>
        <!-- Success -->
        <div class="flex items-center gap-3 p-3 bg-stitch-surface-container-low rounded-lg border border-stitch-outline-variant">
          <div class="w-8 h-8 rounded-full bg-stitch-surface-variant flex items-center justify-center">
            <History class="w-4 h-4 text-stitch-on-surface-variant" />
          </div>
          <div class="flex-1">
            <p class="text-sm text-stitch-on-surface">Clock-out attempt</p>
            <p class="text-xs text-stitch-on-surface-variant">Yesterday at 05:15 PM</p>
          </div>
          <span class="text-xs font-medium flex items-center gap-1" :class="statusStyles.success.text">
            <CheckCircle class="w-3 h-3" /> Success
          </span>
        </div>
      </div>
    </section>
  </AppPwaLayout>
</template>
