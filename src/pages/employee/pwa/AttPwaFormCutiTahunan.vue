<script setup lang="ts">
/**
 * AttPwaFormCutiTahunan.vue
 *
 * Employee PWA — Annual Leave (Cuti Tahunan) submission form.
 *
 * @packageDocumentation
 */
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  Save,
  Calendar,
  Palmtree,
  Plus,
  Minus,
  Paperclip,
  Info,
} from 'lucide-vue-next'

const router = useRouter()

const leaveType = ref('Cuti Regular')
const leaveTypes = ['Cuti Regular', 'Cuti Besar', 'Cuti Melahirkan']
const reason = ref('')
const attachment = ref<File | null>(null)
const startDate = ref('12 Okt 2023')
const endDate = ref('15 Okt 2023')
const days = ref(3)

const remainingDays = computed(() => 12 - days.value)

const leaveTypes2 = [
  { key: 'regular', label: 'Cuti Regular' },
  { key: 'besar', label: 'Cuti Besar' },
  { key: 'melahirkan', label: 'Cuti Melahirkan' },
]
const selectedType = ref('regular')

function incrementDays(): void {
  if (days.value < 7) days.value++
}
function decrementDays(): void {
  if (days.value > 1) days.value--
}

async function handleSubmit(): Promise<void> {
  // TODO: Wire up API
  alert('Pengajuan Cuti Tahunan dikirim!')
  router.push('/pwa/pengajuan')
}

function handleSaveDraft(): void {
  alert('Draft disimpan!')
}
</script>

<template>
  <AppPwaLayout>
    <template #title>
      <span class="text-base font-semibold text-stitch-primary">Cuti Tahunan</span>
    </template>
    <template #actions>
      <button
        class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-stitch-surface-container-high transition-colors"
        aria-label="Save draft"
        @click="handleSaveDraft"
      >
        <Save class="w-5 h-5 text-stitch-primary" />
      </button>
    </template>

    <!-- ── Quota Info Card ─────────────────────────────── -->
    <section class="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3 mb-4">
      <div class="bg-green-500 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-sm flex-shrink-0">
        <Palmtree class="w-6 h-6" />
      </div>
      <div class="flex-1">
        <p class="text-[10px] font-medium text-green-800 uppercase tracking-wider">Sisa Cuti Tahunan</p>
        <div class="flex items-baseline gap-1">
          <span class="text-[32px] font-bold text-green-900 leading-tight">{{ 12 }}</span>
          <span class="text-sm text-green-700">hari</span>
        </div>
        <p class="text-xs text-green-700 mt-0.5">dari 14 hari per tahun</p>
      </div>
    </section>

    <!-- ── Form ──────────────────────────────────────── -->
    <section class="bg-white border border-stitch-outline-variant rounded-xl p-4 space-y-4 mb-4 shadow-sm">

      <!-- Date Range -->
      <div class="space-y-1">
        <label class="text-xs font-medium text-stitch-on-surface-variant block">Periode Cuti</label>
        <div class="grid grid-cols-2 gap-2">
          <div class="relative">
            <input
              v-model="startDate"
              class="w-full h-12 px-3 pt-2 border border-stitch-outline rounded-xl text-sm focus:ring-2 focus:ring-stitch-primary-fixed-dim focus:border-stitch-primary outline-none transition-all bg-transparent"
              type="text"
            />
            <Calendar class="absolute right-3 top-3 w-4 h-4 text-stitch-outline pointer-events-none" />
          </div>
          <div class="relative">
            <input
              v-model="endDate"
              class="w-full h-12 px-3 pt-2 border border-stitch-outline rounded-xl text-sm focus:ring-2 focus:ring-stitch-primary-fixed-dim focus:border-stitch-primary outline-none transition-all bg-transparent"
              type="text"
            />
            <Calendar class="absolute right-3 top-3 w-4 h-4 text-stitch-outline pointer-events-none" />
          </div>
        </div>
        <p class="text-xs text-stitch-on-surface-variant flex items-center gap-1">
          <Info class="w-3 h-3" />
          Maks. 7 hari sekaligus
        </p>
      </div>

      <!-- Day Stepper -->
      <div class="space-y-1">
        <label class="text-xs font-medium text-stitch-on-surface-variant block">Jumlah Hari</label>
        <div class="flex items-center gap-4">
          <div class="flex items-center border border-stitch-outline rounded-xl">
            <button
              class="w-11 h-11 flex items-center justify-center rounded-lg hover:bg-stitch-surface-container transition-colors text-stitch-primary"
              @click="decrementDays"
            >
              <Minus class="w-4 h-4" />
            </button>
            <span class="w-12 text-center font-semibold text-stitch-on-surface">{{ days }}</span>
            <button
              class="w-11 h-11 flex items-center justify-center rounded-lg hover:bg-stitch-surface-container transition-colors text-stitch-primary"
              @click="incrementDays"
            >
              <Plus class="w-4 h-4" />
            </button>
          </div>
          <div>
            <p class="text-xs font-medium text-stitch-on-surface">Hari Kerja</p>
            <p class="text-xs italic text-stitch-on-surface-variant">Sisa yang akan digunakan: {{ remainingDays }} hari</p>
          </div>
        </div>
      </div>

      <!-- Leave Type Pills -->
      <div class="space-y-1">
        <label class="text-xs font-medium text-stitch-on-surface-variant block">Jenis Cuti</label>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="t in leaveTypes"
            :key="t"
            class="px-4 h-10 rounded-full text-xs font-medium border transition-all"
            :class="
              leaveType === t
                ? 'bg-stitch-primary text-stitch-on-primary border-stitch-primary'
                : 'border-stitch-outline text-stitch-on-surface-variant hover:bg-stitch-surface-container'
            "
            @click="leaveType = t"
          >
            {{ t }}
          </button>
        </div>
      </div>

      <!-- Reason Textarea -->
      <div class="space-y-1">
        <div class="flex justify-between items-center">
          <label class="text-xs font-medium text-stitch-on-surface-variant">Keterangan / Alasan</label>
          <span class="text-[10px] text-stitch-outline">{{ reason.length }}/200</span>
        </div>
        <textarea
          v-model="reason"
          class="w-full p-3 border border-stitch-outline rounded-xl text-sm focus:ring-2 focus:ring-stitch-primary-fixed-dim focus:border-stitch-primary outline-none transition-all resize-none"
          placeholder="Jelaskan alasan pengambilan cuti..."
          rows="4"
        />
      </div>

      <!-- Attachment -->
      <div class="space-y-1">
        <label class="text-xs font-medium text-stitch-on-surface-variant block">Lampiran (opsional)</label>
        <button class="flex items-center justify-center gap-2 border border-stitch-primary text-stitch-primary px-4 py-2 rounded-full text-xs font-medium hover:bg-stitch-primary-fixed transition-colors">
          <Paperclip class="w-4 h-4" />
          Tambahkan file
        </button>
        <p class="text-[10px] text-stitch-on-surface-variant">PDF, JPG, PNG (maks. 5MB)</p>
      </div>
    </section>

    <!-- ── Coverage Info ──────────────────────────────── -->
    <div class="bg-stitch-surface-container border border-stitch-outline-variant rounded-xl p-3 flex items-start gap-2 mb-4">
      <Info class="w-4 h-4 text-stitch-primary flex-shrink-0 mt-0.5" />
      <p class="text-xs text-stitch-on-surface-variant">
        Cuti Anda akan mencakup <span class="font-semibold text-stitch-on-surface">{{ days }}</span> hari kerja (tidak termasuk Sabtu/Minggu).
      </p>
    </div>

    <!-- ── Actions ──────────────────────────────────── -->
    <div class="flex flex-col gap-3">
      <button
        class="w-full h-14 bg-stitch-primary text-white rounded-full font-bold text-sm shadow-md hover:bg-stitch-primary-container transition-all active:scale-95"
        @click="handleSubmit"
      >
        Kirim Pengajuan
      </button>
      <button
        class="w-full h-12 border border-stitch-outline text-stitch-on-surface-variant rounded-full text-xs font-medium hover:bg-stitch-surface-container transition-all"
        @click="handleSaveDraft"
      >
        Simpan Draft
      </button>
    </div>
  </AppPwaLayout>
</template>
