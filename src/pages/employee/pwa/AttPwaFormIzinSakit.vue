<script setup lang="ts">
/**
 * AttPwaFormIzinSakit.vue
 *
 * Employee PWA — Sick Leave (Izin Sakit) submission form.
 *
 * @packageDocumentation
 */
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  Stethoscope,
  Info,
  Calendar,
  Plus,
  Minus,
  Paperclip,
  Camera,
  AlertTriangle,
} from 'lucide-vue-next'

const router = useRouter()

const sickDate = ref('14 Mei 2026')
const duration = ref(1)
const illnessType = ref('Demam/Flu')
const description = ref('')
const doctorCertUploaded = ref(false)
const doctorName = ref('')

const illnessTypes = ['Demam/Flu', 'Maag/Gastro', 'Sakit Kepala', 'Cedera', 'Lainnya']

const needsCert = computed(() => duration.value > 2)
const certRequired = computed(() => needsCert.value)

async function handleSubmit(): Promise<void> {
  if (certRequired.value && !doctorCertUploaded.value) {
    alert('Surat dokter wajib untuk izin lebih dari 2 hari.')
    return
  }
  alert('Pengajuan Izin Sakit dikirim!')
  router.push('/pwa/pengajuan')
}
</script>

<template>
  <AppPwaLayout>
    <template #title>
      <span class="text-base font-semibold text-stitch-primary">Izin Sakit</span>
    </template>

    <!-- ── Info Banner ────────────────────────────── -->
    <section class="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
      <div class="flex items-start gap-3">
        <div class="bg-green-500 text-white w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
          <Stethoscope class="w-5 h-5" />
        </div>
        <div>
          <p class="text-sm font-semibold text-green-800">Izin Sakit</p>
          <p class="text-xs text-green-700 mt-0.5">Butuh surat dokter untuk sakit lebih dari 2 hari</p>
          <p class="text-[10px] text-green-600 mt-1">Surat dokter wajib dilampirkan untuk izin 3+ hari</p>
        </div>
      </div>
    </section>

    <!-- ── Form ────────────────────────────────── -->
    <section class="bg-white border border-stitch-outline-variant rounded-xl p-4 space-y-4 mb-4 shadow-sm">

      <!-- Date -->
      <div class="space-y-1">
        <label class="text-xs font-medium text-stitch-on-surface-variant block">Tanggal Izin Sakit</label>
        <div class="relative">
          <input
            v-model="sickDate"
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
          <!-- Warning -->
          <div
            v-if="needsCert"
            class="flex items-center gap-1.5 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full"
          >
            <AlertTriangle class="w-3.5 h-3.5 text-amber-600" />
            <span class="text-xs font-medium text-amber-700">Perlu surat dokter</span>
          </div>
        </div>
      </div>

      <!-- Illness Type -->
      <div class="space-y-1">
        <label class="text-xs font-medium text-stitch-on-surface-variant block">Jenis Keluhan</label>
        <select
          v-model="illnessType"
          class="w-full h-12 px-3 border border-stitch-outline rounded-xl text-sm focus:ring-2 focus:ring-stitch-primary-fixed-dim focus:border-stitch-primary outline-none transition-all bg-transparent appearance-none"
        >
          <option v-for="t in illnessTypes" :key="t">{{ t }}</option>
        </select>
      </div>

      <!-- Description -->
      <div class="space-y-1">
        <div class="flex justify-between items-center">
          <label class="text-xs font-medium text-stitch-on-surface-variant">Deskripsi Keluhan (opsional)</label>
          <span class="text-[10px] text-stitch-outline">{{ description.length }}/200</span>
        </div>
        <textarea
          v-model="description"
          class="w-full p-3 border border-stitch-outline rounded-xl text-sm focus:ring-2 focus:ring-stitch-primary-fixed-dim focus:border-stitch-primary outline-none resize-none"
          placeholder="Jelaskan gejala atau keluhan Anda..."
          rows="3"
        />
      </div>

      <!-- Medical Certificate Upload (conditional) -->
      <div v-if="certRequired" class="space-y-1">
        <label class="text-xs font-medium text-stitch-primary flex items-center gap-1">
          📋 Surat Dokter (Wajib)
        </label>
        <div class="border-2 border-dashed border-stitch-outline rounded-xl p-4 text-center hover:border-stitch-primary transition-colors cursor-pointer">
          <Camera class="w-8 h-8 text-stitch-outline mx-auto mb-2" />
          <p class="text-xs font-medium text-stitch-on-surface">Ambil Foto / Pilih File</p>
          <p class="text-[10px] text-stitch-outline mt-1">PDF, JPG, PNG (maks. 5MB)</p>
        </div>
        <div
          v-if="doctorCertUploaded"
          class="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded-lg"
        >
          <Paperclip class="w-4 h-4 text-green-600" />
          <span class="text-xs text-green-700 flex-1">surat_dokter_rizki.pdf</span>
          <button class="text-xs text-stitch-error">Hapus</button>
        </div>
      </div>

      <!-- Doctor Name (conditional) -->
      <div v-if="certRequired" class="space-y-1">
        <label class="text-xs font-medium text-stitch-on-surface-variant block">Nama Dokter</label>
        <input
          v-model="doctorName"
          class="w-full h-12 px-3 border border-stitch-outline rounded-xl text-sm focus:ring-2 focus:ring-stitch-primary-fixed-dim focus:border-stitch-primary outline-none bg-transparent"
          placeholder="Dr. Budi Santoso"
          type="text"
        />
      </div>
    </section>

    <!-- ── HR Notice ─────────────────────────────── -->
    <div class="bg-stitch-surface-container border border-stitch-outline-variant rounded-xl p-3 flex items-start gap-2 mb-4">
      <Info class="w-4 h-4 text-stitch-primary flex-shrink-0 mt-0.5" />
      <p class="text-xs text-stitch-on-surface-variant">
        HR akan menghubungi Anda untuk konfirmasi
      </p>
    </div>

    <!-- ── Actions ──────────────────────────────── -->
    <div class="flex flex-col gap-3">
      <button
        class="w-full h-14 rounded-full font-bold text-sm shadow-md transition-all active:scale-95"
        :class="certRequired ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-stitch-primary hover:bg-stitch-primary-container text-white'"
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
