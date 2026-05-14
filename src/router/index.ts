import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const routes: RouteRecordRaw[] = [
  {
    path: '/auth',
    component: () => import('@/layouts/AuthLayout.vue'),
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import('@/pages/auth/LoginPage.vue'),
        meta: { requiresAuth: false },
      },
    ],
  },
  {
    path: '/',
    component: () => import('@/layouts/AppLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'dashboard',
        component: () => import('@/pages/employee/DashboardPage.vue'),
        meta: { role: 'employee' },
      },
      {
        path: 'history',
        name: 'history',
        component: () => import('@/pages/employee/HistoryPage.vue'),
        meta: { role: 'employee' },
      },
      {
        path: 'leave',
        name: 'leave-request',
        component: () => import('@/pages/employee/LeaveRequestPage.vue'),
        meta: { role: 'employee' },
      },
    ],
  },
  {
    path: '/admin',
    component: () => import('@/layouts/AppLayout.vue'),
    meta: { requiresAuth: true, role: 'admin' },
    children: [
      {
        path: '',
        name: 'admin-dashboard',
        component: () => import('@/pages/admin/DashboardPage.vue'),
      },
      {
        path: 'employees',
        name: 'admin-employees',
        component: () => import('@/pages/admin/EmployeeManagementPage.vue'),
      },
      {
        path: 'payroll',
        name: 'admin-payroll',
        component: () => import('@/pages/admin/PayrollPage.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore()
  if (to.meta.requiresAuth !== false && !authStore.isAuthenticated) {
    next({ name: 'login' })
    return
  }
  if (to.meta.role === 'admin' && !authStore.isAdmin) {
    next({ name: 'dashboard' })
    return
  }
  if (to.name === 'login' && authStore.isAuthenticated) {
    next({ name: 'dashboard' })
    return
  }
  next()
})

export default router
