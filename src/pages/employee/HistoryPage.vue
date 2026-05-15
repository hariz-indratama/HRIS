<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-foreground">
        Attendance History
      </h1>
      <p class="text-muted-foreground text-sm mt-1">
        Your recent attendance records
      </p>
    </div>

    <!-- Filter Controls -->
    <div class="flex flex-wrap gap-3">
      <select
        v-model="selectedMonth"
        class="px-3 py-2 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        @change="loadHistory"
      >
        <option
          v-for="m in months"
          :key="m.value"
          :value="m.value"
        >
          {{ m.label }}
        </option>
      </select>
      <select
        v-model="selectedYear"
        class="px-3 py-2 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        @change="loadHistory"
      >
        <option
          v-for="y in years"
          :key="y"
          :value="y"
        >
          {{ y }}
        </option>
      </select>
    </div>

    <!-- History List -->
    <div
      v-if="isLoading"
      class="text-center py-12"
    >
      <p class="text-muted-foreground">
        Loading...
      </p>
    </div>
    <div
      v-else-if="attendanceStore.attendanceHistory.length === 0"
      class="text-center py-12"
    >
      <p class="text-muted-foreground">
        No attendance records found.
      </p>
    </div>
    <div
      v-else
      class="space-y-3"
    >
      <div
        v-for="record in attendanceStore.attendanceHistory"
        :key="record.id"
        class="bg-card rounded-lg border border-border p-4 shadow-sm flex items-center justify-between gap-4"
      >
        <div>
          <p class="text-sm font-medium text-foreground">
            {{ formatDate(record.clockIn) }}
          </p>
          <p class="text-xs text-muted-foreground mt-0.5">
            {{ formatTime(record.clockIn) }}
            <span v-if="record.clockOut"> — {{ formatTime(record.clockOut) }}</span>
          </p>
        </div>
        <div class="flex items-center gap-3">
          <span
            v-if="record.totalHours != null"
            class="text-sm text-muted-foreground"
          >
            {{ (record.totalHours ?? 0).toFixed(1) }}h
          </span>
          <span
            class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
            :class="statusBadgeClass(record.status)"
          >
            {{ record.status }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAttendanceStore } from '@/stores/attendanceStore'

const attendanceStore = useAttendanceStore()
const isLoading = ref(false)

const now = new Date()
const selectedMonth = ref(now.getMonth() + 1)
const selectedYear = ref(now.getFullYear())

const months = [
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' },
]

const years = Array.from({ length: 5 }, (_, i) => now.getFullYear() - i)

function formatDate(iso: string | null): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function formatTime(iso: string | null): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

function statusBadgeClass(status: string): Record<string, boolean> {
  return {
    'bg-success/10 text-success': status === 'on-time',
    'bg-warning/10 text-warning': status === 'late',
    'bg-destructive/10 text-destructive': status === 'absent',
  }
}

async function loadHistory(): Promise<void> {
  isLoading.value = true
  try {
    await attendanceStore.fetchHistory({
      page: 1,
      month: selectedMonth.value,
      year: selectedYear.value,
    })
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadHistory()
})
</script>
