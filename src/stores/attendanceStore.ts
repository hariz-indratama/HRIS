import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Attendance } from '@/types/models/Attendance'
import { attendanceApi } from '@/services/api/attendanceApi'

export const useAttendanceStore = defineStore('attendance', () => {
  const todayAttendance = ref<Attendance | null>(null)
  const attendanceHistory = ref<Attendance[]>([])
  const isLoading = ref(false)

  async function fetchToday(): Promise<void> {
    isLoading.value = true
    try {
      const response = await attendanceApi.getToday()
      todayAttendance.value = response.data
    } catch {
      todayAttendance.value = null
    } finally {
      isLoading.value = false
    }
  }

  async function fetchHistory(params?: { page?: number; per_page?: number; month?: number; year?: number }): Promise<void> {
    isLoading.value = true
    try {
      const response = await attendanceApi.getHistory(params)
      attendanceHistory.value = response.data
    } finally {
      isLoading.value = false
    }
  }

  async function clockIn(latitude: number, longitude: number, deviceId: string): Promise<void> {
    isLoading.value = true
    try {
      const response = await attendanceApi.clockIn({ latitude, longitude, device_id: deviceId })
      todayAttendance.value = response.data
    } finally {
      isLoading.value = false
    }
  }

  async function clockOut(latitude: number, longitude: number, attendanceId: number): Promise<void> {
    isLoading.value = true
    try {
      await attendanceApi.clockOut({ latitude, longitude, attendance_id: attendanceId })
      todayAttendance.value = null
    } finally {
      isLoading.value = false
    }
  }

  return {
    todayAttendance,
    attendanceHistory,
    isLoading,
    fetchToday,
    fetchHistory,
    clockIn,
    clockOut,
  }
})