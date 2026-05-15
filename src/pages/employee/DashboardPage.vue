<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-foreground">
        Dashboard
      </h1>
      <p class="text-muted-foreground text-sm mt-1">
        Welcome back, {{ authStore.user?.name }}
      </p>
    </div>

    <!-- Today's Attendance Status -->
    <div class="bg-card rounded-lg border border-border p-6 shadow-sm">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold text-foreground">
          Today's Attendance
        </h2>
        <span class="text-2xl font-mono text-foreground">{{ currentTime }}</span>
      </div>

      <div class="flex items-center gap-4 mb-6">
        <span
          class="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium"
          :class="statusBadgeClass"
        >
          {{ statusLabel }}
        </span>
        <span class="text-sm text-muted-foreground">{{ currentDate }}</span>
      </div>

      <button
        v-if="!attendanceStore.todayAttendance"
        :disabled="isLoading"
        class="w-full sm:w-auto px-8 py-3 rounded-md bg-primary text-primary-foreground font-semibold hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 transition-colors"
        @click="handleClockIn"
      >
        {{ isLoading ? 'Processing...' : 'Clock In' }}
      </button>
      <button
        v-else
        :disabled="isLoading"
        class="w-full sm:w-auto px-8 py-3 rounded-md bg-destructive text-destructive-foreground font-semibold hover:bg-destructive/90 focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 transition-colors"
        @click="handleClockOut"
      >
        {{ isLoading ? 'Processing...' : 'Clock Out' }}
      </button>
    </div>

    <!-- Weekly Summary -->
    <div class="bg-card rounded-lg border border-border p-6 shadow-sm">
      <h2 class="text-lg font-semibold text-foreground mb-4">
        This Week
      </h2>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div class="bg-accent rounded-md p-4 text-center">
          <p class="text-2xl font-bold text-foreground">
            {{ weeklyDaysWorked }}
          </p>
          <p class="text-xs text-muted-foreground mt-1">
            Days Worked
          </p>
        </div>
        <div class="bg-accent rounded-md p-4 text-center">
          <p class="text-2xl font-bold text-foreground">
            {{ weeklyTotalHours }}
          </p>
          <p class="text-xs text-muted-foreground mt-1">
            Total Hours
          </p>
        </div>
        <div class="bg-accent rounded-md p-4 text-center">
          <p class="text-2xl font-bold text-destructive">
            {{ weeklyLate }}
          </p>
          <p class="text-xs text-muted-foreground mt-1">
            Late
          </p>
        </div>
        <div class="bg-accent rounded-md p-4 text-center">
          <p class="text-2xl font-bold text-foreground">
            {{ weeklyOnTime }}
          </p>
          <p class="text-xs text-muted-foreground mt-1">
            On Time
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useAttendanceStore } from '@/stores/attendanceStore'

const authStore = useAuthStore()
const attendanceStore = useAttendanceStore()

const isLoading = ref(false)
const currentTime = ref('')
const currentDate = ref('')
let clockInterval: ReturnType<typeof setInterval>

function updateClock(): void {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  currentDate.value = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
}

const statusLabel = computed(() => {
  const a = attendanceStore.todayAttendance
  if (!a) return 'Not Checked In'
  if (!a.clockOut) return 'Checked In'
  return 'Completed'
})

const statusBadgeClass = computed(() => {
  const a = attendanceStore.todayAttendance
  if (!a) return 'bg-muted text-muted-foreground'
  if (!a.clockOut) return 'bg-primary/10 text-primary'
  return 'bg-success/10 text-success'
})

const weeklyDaysWorked = computed(() => attendanceStore.attendanceHistory.length)

const weeklyTotalHours = computed(() => {
  const total = attendanceStore.attendanceHistory.reduce(
    (sum, a) => sum + (a.totalHours ?? 0),
    0,
  )
  return total.toFixed(1)
})

const weeklyLate = computed(
  () => attendanceStore.attendanceHistory.filter((a) => a.status === 'late').length,
)

const weeklyOnTime = computed(
  () => attendanceStore.attendanceHistory.filter((a) => a.status === 'on_time').length,
)

async function handleClockIn(): Promise<void> {
  isLoading.value = true
  try {
    // Geolocation would be called here; using fallback values for now
    await attendanceStore.clockIn(0, 0, 'web-client')
  } finally {
    isLoading.value = false
  }
}

async function handleClockOut(): Promise<void> {
  isLoading.value = true
  try {
    const attendance = attendanceStore.todayAttendance
    if (attendance) {
      await attendanceStore.clockOut(0, 0, attendance.id)
    }
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  updateClock()
  clockInterval = setInterval(updateClock, 1000)
  await Promise.all([
    attendanceStore.fetchToday(),
    attendanceStore.fetchHistory(),
  ])
})

onUnmounted(() => {
  clearInterval(clockInterval)
})
</script>
