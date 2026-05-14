export interface Attendance {
  id: number
  userId: number
  clockIn: string
  clockOut: string | null
  totalHours: number | null
  status: 'on-time' | 'late' | 'absent'
  location: {
    latitude: number
    longitude: number
  }
  createdAt: string
  updatedAt: string
}
