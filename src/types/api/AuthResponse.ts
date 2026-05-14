import type { User } from '@/types/models/User'

export interface AuthResponse {
  success: boolean
  user: User
  token: string
}
