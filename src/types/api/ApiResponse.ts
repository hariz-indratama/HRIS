export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
  code?: number
  meta?: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}
