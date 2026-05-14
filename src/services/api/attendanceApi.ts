import apiClient from './client'
import type { Attendance } from '@/types/models/Attendance'

export interface ClockInPayload {
  latitude: number
  longitude: number
  device_id?: string
}

export interface ClockOutPayload {
  latitude: number
  longitude: number
  attendance_id: number
  device_id?: string
}

export interface AttendanceListResponse {
  success: boolean
  data: Attendance[]
  meta?: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}

export interface AttendanceSingleResponse {
  success: boolean
  data: Attendance | null
}

export const attendanceApi = {
  async clockIn(payload: ClockInPayload): Promise<{ success: boolean; data: Attendance; message: string }> {
    const response = await apiClient.post('/employee/attendance/clock-in', payload)
    return response.data
  },

  async clockOut(payload: ClockOutPayload): Promise<{ success: boolean; data: Attendance; message: string }> {
    const response = await apiClient.post('/employee/attendance/clock-out', payload)
    return response.data
  },

  async getToday(): Promise<AttendanceSingleResponse> {
    const response = await apiClient.get<AttendanceSingleResponse>('/employee/attendance/today')
    return response.data
  },

  async getHistory(params?: {
    page?: number
    per_page?: number
    month?: number
    year?: number
    status?: 'on_time' | 'late' | 'absent'
  }): Promise<AttendanceListResponse> {
    const response = await apiClient.get<AttendanceListResponse>('/employee/attendance/history', { params })
    return response.data
  },
}
