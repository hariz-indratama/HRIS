export interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'employee'
  department: string | null
  position: string | null
  avatarUrl: string | null
  phone: string | null
  hourlyRate?: number
  departmentId?: number
  avatar?: string
  createdAt: string
  updatedAt: string
}
