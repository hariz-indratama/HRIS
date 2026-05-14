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
  createdAt: string
  updatedAt: string
}