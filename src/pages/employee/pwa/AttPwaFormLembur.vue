<script setup lang="ts">
/**
 * AttPwaFormLembur.vue
 *
 * Employee PWA — Overtime (Lembur) submission form.
 *
 * @packageDocumentation
 */
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  Clock,
  Info,
  Calendar,
  Paperclip,
} from 'lucide-vue-next'

const router = useRouter()

const otDate = ref('14 Mei 2026')
const startTime = ref('17:00')
const endTime = ref('21:00')
const breakHours = ref('0 jam')
const description = ref('')
const compType = ref<'uang' | 'timeoff'>('uang')

const breakOptions = ['0 jam', '30 menit', '1 jam']

// Simple duration calc (rough)
const duration = computed(() => {
  const [sh, sm] = startTime.value.split(':').map(Number)
  const [eh, em] = endTime.value.split(':').map(Number)
  const mins = (eh * 60 + (em || 0)) - (sh * 60 + (sm || 0)) - (breakHours.value === '30 menit' ? 30 : breakHours.value === '1 jam' ? 60 : 0)
  return Math.max(0, Math.floor(mins / 60))
})

async function handleSubmit(): Promise<void> {
  // TODO: Wire up API
  alert('Pengajuan Lembur dikirim!')
  router.push('/pwa/pengajuan')
}
</script>

<template>
  <AppPwaLayout>
    <template #title>
      <span class="text-base font-semibold text-foreground">Pengajuan Lembur</span>
    </template>

    <!-- ── Quota Card ──────────────────────────────── -->
    <section class="bg-warning/10 border border-warning/20 rounded-xl p-4 flex items-center gap-3 mb-4">
      <div class="bg-warning/100 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-sm flex-shrink-0">
        <Clock class="w-6 h-6" />
      </div>
      <div class="flex-1">
        <p class="text-[10px] font-medium text-warning uppercase tracking-wider">Total Lembur Bulan Ini</p>
        <div class="flex items-baseline gap-1">
          <span class="text-[32px] font-bold text-warning leading-tight">8 jam</span>
        </div>
        <p class="text-xs text-warning mt-0.5">Sisa batas lembur: 16 jam</p>
      </div>
    </section>

    <!-- ── Form ────────────────────────────────── -->
    <section class="bg-white border border-border rounded-xl p-4 space-y-4 mb-4 shadow-sm">

      <!-- Date -->
      <div class="space-y-1">
        <label class="text-xs font-medium text-muted-foreground block">Tanggal Lembur</label>
        <div class="relative">
          <input
            v-model="otDate"
            class="w-full h-12 px-3 pt-2 border border-border rounded-xl text-sm focus:ring-2 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none bg-transparent"
            type="text"
          />
          <Calendar class="absolute right-3 top-3 w-4 h-4 text-muted pointer-events-none" />
        </div>
      </div>

      <!-- Time Range -->
      <div class="space-y-1">
        <label class="text-xs font-medium text-muted-foreground block">Waktu Lembur</label>
        <div class="grid grid-cols-2 gap-2">
          <div class="relative">
            <input
              v-model="startTime"
              class="w-full h-12 px-3 pt-2 border border-border rounded-xl text-sm focus:ring-2 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none bg-transparent"
              type="text"
              placeholder="Jam Mulai"
            />
            <Clock class="absolute right-3 top-3 w-4 h-4 text-muted pointer-events-none" />
          </div>
          <div class="relative">
            <input
              v-model="endTime"
              class="w-full h-12 px-3 pt-2 border border-border rounded-xl text-sm focus:ring-2 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none bg-transparent"
              type="text"
              placeholder="Jam Selesai"
            />
            <Clock class="absolute right-3 top-3 w-4 h-4 text-muted pointer-events-none" />
          </div>
        </div>
        <!-- Duration badge -->
        <div class="flex items-center gap-2">
          <span class="px-3 py-1 rounded-full bg-warning/10 border border-warning/20 text-xs font-semibold text-warning">
            {{ duration }} jam
          </span>
          <p class="text-[10px] text-muted-foreground italic">Waktu istirahat tidak dihitung</p>
        </div>
      </div>

      <!-- Break Duration -->
      <div class="space-y-1">
        <label class="text-xs font-medium text-muted-foreground block">Istirahat (jika ada)</label>
        <div class="flex gap-2">
          <button
            v-for="opt in breakOptions"
            :key="opt"
            class="flex-1 h-10 rounded-xl text-xs font-medium border transition-all"
            :class="
              breakHours === opt
                ? 'bg-primary text-primary-foreground border-primary'
                : 'border-border text-muted-foreground hover:bg-muted'
            "
            @click="breakHours = opt"
          >
            {{ opt }}
          </button>
        </div>
      </div>

      <!-- Description -->
      <div class="space-y-1">
        <div class="flex justify-between items-center">
          <label class="text-xs font-medium text-muted-foreground">Deskripsi Pekerjaan</label>
          <span class="text-[10px] text-muted">{{ description.length }}/300</span>
        </div>
        <textarea
          v-model="description"
          class="w-full p-3 border border-border rounded-xl text-sm focus:ring-2 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none resize-none"
          placeholder="Jelaskan pekerjaan yang akan dilakukan..."
          rows="4"
        />
      </div>

      <!-- Compensation Type -->
      <div class="space-y-1">
        <label class="text-xs font-medium text-muted-foreground block">Jenis Kompensasi</label>
        <div class="flex gap-2">
          <button
            class="flex-1 h-10 rounded-full text-xs font-medium border transition-all"
            :class="
              compType === 'uang'
                ? 'bg-primary text-primary-foreground border-primary'
                : 'border-border text-muted-foreground hover:bg-muted'
            "
            @click="compType = 'uang'"
          >
            💰 Uang Lembur
          </button>
          <button
            class="flex-1 h-10 rounded-full text-xs font-medium border transition-all"
            :class="
              compType === 'timeoff'
                ? 'bg-primary text-primary-foreground border-primary'
                : 'border-border text-muted-foreground hover:bg-muted'
            "
            @click="compType = 'timeoff'"
          >
            🔁 Time Off
          </button>
        </div>
        <p v-if="compType === 'timeoff'" class="text-[10px] text-muted-foreground italic">
          Ganti hari libur
        </p>
      </div>

      <!-- Attachment -->
      <div class="space-y-1">
        <label class="text-xs font-medium text-muted-foreground block">Lampiran (opsional)</label>
        <button class="flex items-center justify-center gap-2 border border-border text-foreground px-4 py-2 rounded-full text-xs font-medium hover:bg-muted transition-colors">
          <Paperclip class="w-4 h-4" />
          Tambahkan file
        </button>
        <p class="text-[10px] text-muted-foreground">PDF, JPG, PNG (maks. 5MB)</p>
      </div>
    </section>

    <!-- ── Approval Info ───────────────────────────── -->
    <div class="bg-muted border border-border rounded-xl p-3 flex items-start gap-2 mb-4">
      <Info class="w-4 h-4 text-foreground flex-shrink-0 mt-0.5" />
      <p class="text-xs text-muted-foreground">
        <span class="font-semibold text-foreground">Persetujuan Required:</span> Anda → Supervisor → HR
      </p>
    </div>

    <!-- ── Actions ──────────────────────────────── -->
    <div class="flex flex-col gap-3">
      <button
        class="w-full h-14 bg-primary text-white rounded-full font-bold text-sm shadow-md hover:bg-primary/90 transition-all active:scale-95"
        @click="handleSubmit"
      >
        Kirim Pengajuan
      </button>
      <button
        class="w-full h-12 border border-border text-muted-foreground rounded-full text-xs font-medium hover:bg-muted transition-all"
      >
        Simpan Draft
      </button>
    </div>
  </AppPwaLayout>
</template>
