/**
 * useAttendance.ts
 *
 * Composable for attendance-related state and actions.
 * Wraps the attendance store with convenience helpers for clock-in / clock-out
 * status and device ID generation.
 *
 * @packageDocumentation
 */

import { computed, ref } from 'vue'
import { useAttendanceStore } from '@/stores/attendanceStore'

export function useAttendance() {
  const store = useAttendanceStore()
  const error = ref<string | null>(null)

  // ─── Computed ────────────────────────────────────────────────────────────────

  /** Derives a human-readable status string for today's attendance. */
  const todayStatus = computed(() => {
    if (!store.todayAttendance) return 'not-checked-in'
    return store.todayAttendance.clockOut ? 'completed' : 'checked-in'
  })

  /** True when the user has clocked in but not yet clocked out. */
  const clockedIn = computed(
    () => store.todayAttendance !== null && store.todayAttendance.clockOut === null,
  )

  // ─── Helpers ───────────────────────────────────────────────────────────────────

  /**
   * Returns a persistent device identifier stored in localStorage.
   * Generates a new UUID v4 if one does not yet exist.
   */
  async function getDeviceId(): Promise<string> {
    let deviceId = localStorage.getItem('device_id')
    if (!deviceId) {
      deviceId = crypto.randomUUID()
      localStorage.setItem('device_id', deviceId)
    }
    return deviceId
  }

  // ─── Actions ───────────────────────────────────────────────────────────────────

  /**
   * Records a clock-in at the given geographic coordinates.
   *
   * @param latitude  - Current latitude.
   * @param longitude - Current longitude.
   * @throws Error if the underlying API call fails.
   */
  async function clockIn(latitude: number, longitude: number): Promise<void> {
    error.value = null
    const deviceId = await getDeviceId()
    try {
      await store.clockIn(latitude, longitude, deviceId)
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Clock-in failed'
      throw err
    }
  }

  /**
   * Records a clock-out at the given geographic coordinates.
   *
   * @param latitude  - Current latitude.
   * @param longitude - Current longitude.
   * @throws Error if the underlying API call fails or if there is no active attendance record.
   */
  async function clockOut(latitude: number, longitude: number): Promise<void> {
    error.value = null
    if (!store.todayAttendance) {
      error.value = 'No active attendance record'
      return
    }
    try {
      await store.clockOut(latitude, longitude, store.todayAttendance.id)
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Clock-out failed'
      throw err
    }
  }

  return {
    todayAttendance: computed(() => store.todayAttendance),
    attendanceHistory: computed(() => store.attendanceHistory),
    isLoading: computed(() => store.isLoading),
    todayStatus,
    clockedIn,
    error,
    clockIn,
    clockOut,
    fetchToday: store.fetchToday,
    fetchHistory: store.fetchHistory,
  }
}