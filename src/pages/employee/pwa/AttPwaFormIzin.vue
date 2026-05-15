<script setup lang="ts">
/**
 * AttPwaFormIzin.vue
 *
 * Employee PWA — General Permission (Izin) submission form.
 *
 * @packageDocumentation
 */
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  Calendar,
  Plus,
  Minus,
  Paperclip,
  User,
} from 'lucide-vue-next'

const router = useRouter()

const permissionType = ref('pribadi')
const izinDate = ref('14 Mei 2026')
const duration = ref(1)
const reason = ref('')

const permissionTypes = [
  { key: 'pribadi', label: 'Izin Pribadi' },
  { key: 'dinas', label: 'Tugas Dinas' },
  { key: 'pendidikan', label: 'Pendidikan' },
  { key: 'keluarga', label: 'Urusan Keluarga' },
]

async function handleSubmit(): Promise<void> {
  alert('Pengajuan Izin dikirim!')
  router.push('/pwa/pengajuan')
}
</script>

<template>
  <AppPwaLayout>
    <template #title>
      <span class="text-base font-semibold text-stitch-primary">Izin</span>
    </template>

    <!-- ── Info Banner ────────────────────────────── -->
    <section class="bg-stitch-surface-container border border-stitch-outline-variant rounded-xl p-4 mb-4">
      <div class="flex items-start gap-3">
        <div class="w-10 h-10 rounded-full bg-stitch-secondary-container flex items-center justify-center flex-shrink-0">
          <User class="w-5 h-5 text-stitch-primary" />
        </div>
        <div>
          <p class="text-sm font-semibold text-stitch-on-surface">Izin Tidak Masuk</p>
          <p class="text-xs text-stitch-on-surface-variant mt-0.5">
            Gunakan izin ini untuk keperluan pribadi yang tidak terduga
          </p>
        </div>
      </div>
    </section>

    <!-- ── Permission Type Pills ────────────────── -->
    <section class="bg-white border border-stitch-outline-variant rounded-xl p-4 shadow-sm mb-4">
      <label class="text-xs font-medium text-stitch-on-surface-variant block mb-2">Jenis Izin</label>
      <div class="grid grid-cols-2 gap-2">
        <button
          v-for="t in permissionTypes"
          :key="t.key"
          class="px-3 py-2.5 rounded-xl text-xs font-medium border transition-all flex items-center gap-2"
          :class="
            permissionType === t.key
              ? 'bg-stitch-primary text-stitch-on-primary border-stitch-primary'
              : 'border-stitch-outline text-stitch-on-surface-variant hover:bg-stitch-surface-container'
          "
          @click="permissionType = t.key"
        >
          {{ t.label }}
        </button>
      </div>
    </section>

    <!-- ── Form ────────────────────────────────── -->
    <section class="bg-white border border-stitch-outline-variant rounded-xl p-4 space-y-4 mb-4 shadow-sm">

      <!-- Date -->
      <div class="space-y-1">
        <label class="text-xs font-medium text-stitch-on-surface-variant block">Tanggal Izin</label>
        <div class="relative">
          <input
            v-model="izinDate"
            class="w-full h-12 px-3 pt-2 border border-stitch-outline rounded-xl text-sm focus:ring-2 focus:ring-stitch-primary-fixed-dim focus:border-stitch-primary outline-none bg-transparent"
            type="text"
          />
          <Calendar class="absolute right-3 top-3 w-4 h-4 text-stitch-outline pointer-events-none" />
        </div>
      </div>

      <!-- Duration Stepper -->
      <div class="space-y-1">
        <label class="text-xs font-medium text-stitch-on-surface-variant block">Durasi</label>
        <div class="flex items-center gap-4">
          <div class="flex items-center border border-stitch-outline rounded-xl">
            <button
              class="w-11 h-11 flex items-center justify-center rounded-lg hover:bg-stitch-surface-container text-stitch-primary"
              @click="duration > 1 && duration--"
            >
              <Minus class="w-4 h-4" />
            </button>
            <span class="w-16 text-center font-semibold text-stitch-on-surface">{{ duration }} hari</span>
            <button
              class="w-11 h-11 flex items-center justify-center rounded-lg hover:bg-stitch-surface-container text-stitch-primary"
              @click="duration++"
            >
              <Plus class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <!-- Reason -->
      <div class="space-y-1">
        <div class="flex justify-between items-center">
          <label class="text-xs font-medium text-stitch-on-surface-variant">Alasan</label>
          <span class="text-[10px] text-stitch-outline">{{ reason.length }}/200</span>
        </div>
        <textarea
          v-model="reason"
          class="w-full p-3 border border-stitch-outline rounded-xl text-sm focus:ring-2 focus:ring-stitch-primary-fixed-dim focus:border-stitch-primary outline-none resize-none"
          placeholder="Jelaskan alasan izin Anda..."
          rows="4"
        />
        <p class="text-[10px] text-stitch-outline italic">Tidak wajib untuk Izin Pribadi</p>
      </div>

      <!-- Attachment -->
      <div class="space-y-1">
        <label class="text-xs font-medium text-stitch-on-surface-variant block">Lampiran (opsional)</label>
        <button class="flex items-center justify-center gap-2 border border-stitch-outline text-stitch-primary px-4 py-2 rounded-full text-xs font-medium hover:bg-stitch-surface-container transition-colors">
          <Paperclip class="w-4 h-4" />
          Tambahkan file
        </button>
        <p class="text-[10px] text-stitch-on-surface-variant">PDF, JPG, PNG (maks. 5MB)</p>
      </div>
    </section>

    <!-- ── Approval Info ────────────────────────── -->
    <div class="bg-stitch-surface-container border border-stitch-outline-variant rounded-xl p-3 flex items-start gap-2 mb-4">
      <User class="w-4 h-4 text-stitch-secondary flex-shrink-0 mt-0.5" />
      <p class="text-xs text-stitch-on-surface-variant">
        <span class="font-semibold text-stitch-on-surface">Persetujuan: Supervisor langsung</span>
      </p>
    </div>

    <!-- ── Actions ──────────────────────────────── -->
    <div class="flex flex-col gap-3">
      <button
        class="w-full h-14 bg-stitch-primary text-white rounded-full font-bold text-sm shadow-md hover:bg-stitch-primary-container transition-all active:scale-95"
        @click="handleSubmit"
      >
        Kirim Pengajuan
      </button>
      <button
        class="w-full h-12 border border-stitch-outline text-stitch-on-surface-variant rounded-full text-xs font-medium hover:bg-stitch-surface-container transition-all"
      >
        Batal
      </button>
    </div>
  </AppPwaLayout>
</template>
