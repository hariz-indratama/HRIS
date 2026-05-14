import type { Attendance } from '@/types/models/Attendance'

export interface AttendanceResponse {
  success: boolean
  data: Attendance
  message?: string
}

export interface AttendanceListResponse {
  success: boolean
  data: Attendance[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}
