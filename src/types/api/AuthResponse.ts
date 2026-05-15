import type { User } from '@/types/models/User'

export interface ApiSuccessResponse<T> {
  success: true
  data: T
  message?: string
}

export interface ApiErrorResponse {
  success: false
  message: string
  error_code?: number
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse

export interface LoginResponse {
  success: boolean
  message: string
  data: {
    user: Pick<User, 'id' | 'name' | 'email' | 'role' | 'department' | 'position' | 'avatarUrl' | 'phone'>
  }
}

export interface LogoutResponse {
  success: boolean
  message: string
}

export interface UserProfileResponse {
  success: boolean
  data: {
    id: number
    name: string
    email: string
    role: string
    department: string | null
    position: string | null
    avatarUrl: string | null
    phone: string | null
    joinDate: string | null
    officeStartTime: string | null
  }
}