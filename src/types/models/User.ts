export interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'employee'
  hourlyRate?: number
  departmentId?: number
  avatar?: string
  createdAt: string
  updatedAt: string
}
