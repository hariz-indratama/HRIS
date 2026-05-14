// src/stores/attendanceStore.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Attendance } from '@/types/models/Attendance'
import { attendanceApi } from '@/services/api/attendanceApi'

export const useAttendanceStore = defineStore('attendance', () => {
  const todayAttendance = ref<Attendance | null>(null)
  const attendanceHistory = ref<Attendance[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function fetchToday(): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      const response = await attendanceApi.getToday()
      todayAttendance.value = response.data
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Gagal mengambil data absensi'
      todayAttendance.value = null
    } finally {
      isLoading.value = false
    }
  }

  async function fetchHistory(params?: {
    page?: number
    per_page?: number
    month?: number
    year?: number
  }): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      const response = await attendanceApi.getHistory(params)
      attendanceHistory.value = response.data
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Gagal mengambil riwayat'
    } finally {
      isLoading.value = false
    }
  }

  async function clockIn(latitude: number, longitude: number, deviceId: string): Promise<boolean> {
    isLoading.value = true
    error.value = null
    try {
      const response = await attendanceApi.clockIn({ latitude, longitude, device_id: deviceId })
      todayAttendance.value = response.data
      return true
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Clock-in gagal'
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function clockOut(
    latitude: number,
    longitude: number,
    attendanceId: number,
    deviceId?: string,
  ): Promise<boolean> {
    isLoading.value = true
    error.value = null
    try {
      await attendanceApi.clockOut({ latitude, longitude, attendance_id: attendanceId, device_id: deviceId })
      todayAttendance.value = null
      return true
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Clock-out gagal'
      return false
    } finally {
      isLoading.value = false
    }
  }

  function clearError(): void {
    error.value = null
  }

  return {
    todayAttendance,
    attendanceHistory,
    isLoading,
    error,
    fetchToday,
    fetchHistory,
    clockIn,
    clockOut,
    clearError,
  }
})