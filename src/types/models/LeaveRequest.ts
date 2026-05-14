export interface LeaveRequest {
  id: number
  userId: number
  type: 'sick' | 'vacation' | 'personal' | 'other'
  startDate: string
  endDate: string
  reason?: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
  updatedAt: string
}
