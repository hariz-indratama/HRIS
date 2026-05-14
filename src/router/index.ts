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

  // ── Employee PWA (Mobile-First Attendance) ─────────────────────────────
  {
    path: '/pwa',
    component: () => import('@/layouts/AppPwaLayout.vue'),
    meta: { requiresAuth: true, role: 'employee' },
    children: [
      { path: '', redirect: '/pwa/home' },
      {
        path: 'home',
        name: 'pwa-home',
        component: () => import('@/pages/employee/pwa/AttPwaHomePage.vue'),
      },
      {
        path: 'absen',
        name: 'pwa-absen',
        component: () => import('@/pages/employee/pwa/AttPwaAbsenPage.vue'),
      },
      {
        path: 'riwayat',
        name: 'pwa-riwayat',
        component: () => import('@/pages/employee/pwa/AttPwaRiwayatPage.vue'),
      },
      {
        path: 'profil',
        name: 'pwa-profil',
        component: () => import('@/pages/employee/pwa/AttPwaProfilPage.vue'),
      },
      {
        path: 'pengajuan',
        name: 'pwa-pengajuan',
        component: () => import('@/pages/employee/pwa/AttPwaPengajuanPage.vue'),
      },
      {
        path: 'pengajuan/cuti',
        name: 'pwa-form-cuti',
        component: () => import('@/pages/employee/pwa/AttPwaFormCutiTahunan.vue'),
      },
      {
        path: 'pengajuan/lembur',
        name: 'pwa-form-lembur',
        component: () => import('@/pages/employee/pwa/AttPwaFormLembur.vue'),
      },
      {
        path: 'pengajuan/izin-sakit',
        name: 'pwa-form-izin-sakit',
        component: () => import('@/pages/employee/pwa/AttPwaFormIzinSakit.vue'),
      },
      {
        path: 'pengajuan/izin',
        name: 'pwa-form-izin',
        component: () => import('@/pages/employee/pwa/AttPwaFormIzin.vue'),
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
    next({ name: 'pwa-home' })
    return
  }
  if (to.name === 'login' && authStore.isAuthenticated) {
    // Redirect authenticated employees to the mobile PWA home
    next(authStore.isAdmin ? { name: 'admin-dashboard' } : { name: 'pwa-home' })
    return
  }
  next()
})

export default router
