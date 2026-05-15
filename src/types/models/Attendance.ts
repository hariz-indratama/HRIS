export interface Attendance {
  id: number
  userId: number
  date: string
  clockIn: string | null
  clockOut: string | null
  clockInLat: number | null
  clockInLng: number | null
  clockOutLat: number | null
  clockOutLng: number | null
  status: 'on_time' | 'late' | 'absent'
  notes?: string
  totalHours?: number | null
  createdAt: string
  updatedAt: string
}