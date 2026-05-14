export interface Payroll {
  id: number
  userId: number
  month: number
  year: number
  grossSalary: number
  netSalary: number
  totalWorkHours: number
  hourlyRate: number
  bonus: number
  deduction: number
  status: 'pending' | 'paid'
  createdAt: string
  updatedAt: string
}
