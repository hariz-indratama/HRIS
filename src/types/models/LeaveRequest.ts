export interface LeaveRequest {
  id: number
  userId: number
  type: 'sick' | 'vacation' | 'personal' | 'overtime' | 'other'
  startDate: string
  endDate: string
  days: number
  reason?: string
  status: 'pending' | 'approved' | 'rejected'
  attachmentUrl?: string
  medicalCertUrl?: string
  illnessType?: string
  doctorName?: string
  createdAt: string
  updatedAt: string
}