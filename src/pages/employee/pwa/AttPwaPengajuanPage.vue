<script setup lang="ts">
/**
 * AttPwaPengajuanPage.vue
 *
 * Employee PWA — Requests Hub / Pengajuan screen.
 * Quick stats + 2x2 request type selector + recent requests list.
 *
 * @packageDocumentation
 */
import { computed, onMounted } from "vue";
import {
  Bell,
  Stethoscope,
  Clock,
  Palmtree,
  FileText,
  ChevronRight,
} from "lucide-vue-next";
import { useLeaveStore } from "@/stores/leaveStore";
import { useStatusStyles } from "@/composables/useStatusStyles";

const leaveStore = useLeaveStore();
const statusStyles = useStatusStyles();

const stats = computed(() => [
  {
    icon: Palmtree,
    label: "Cuti Tahunan",
    value: `${leaveStore.vacationBalance} hari`,
    containerClass: [statusStyles.success.bg, statusStyles.success.border].join(" "),
    iconClass: [statusStyles.success.bg, statusStyles.success.text].join(" "),
  },
  {
    icon: Stethoscope,
    label: "Izin Sakit",
    value: `${leaveStore.sickBalance} hari`,
    containerClass: [statusStyles.success.bg, statusStyles.success.border].join(" "),
    iconClass: [statusStyles.success.bg, statusStyles.success.text].join(" "),
  },
  {
    icon: Clock,
    label: "Lembur",
    value:
      leaveStore.overtimeRemaining > 0
        ? `${leaveStore.overtimeRemaining} jam tersisa`
        : "Habis",
    containerClass: [statusStyles.warning.bg, statusStyles.warning.border].join(" "),
    iconClass: [statusStyles.warning.bg, statusStyles.warning.text].join(" "),
  },
  {
    icon: FileText,
    label: "Izin Pribadi",
    value: `${leaveStore.personalBalance} hari`,
    containerClass: [statusStyles.neutral.bg, statusStyles.neutral.border].join(" "),
    iconClass: [statusStyles.neutral.bg, statusStyles.neutral.text].join(" "),
  },
]);

// Fetch balance & requests on mount
onMounted(async () => {
  await Promise.all([
    leaveStore.fetchBalance(),
    leaveStore.fetchMyRequests(),
    leaveStore.fetchOvertimeSummary(),
  ]);
});

const requestTypes = [
  {
    icon: Stethoscope,
    title: "Izin Sakit",
    subtitle: "Kirim surat dokter",
    containerClass: [statusStyles.success.bg, statusStyles.success.border].join(" "),
    iconClass: [statusStyles.success.bg, statusStyles.success.text].join(" "),
    to: "/pwa/pengajuan/izin-sakit",
  },
  {
    icon: Clock,
    title: "Lembur",
    subtitle: "Pengajuan jam lembur",
    containerClass: [statusStyles.warning.bg, statusStyles.warning.border].join(" "),
    iconClass: [statusStyles.warning.bg, statusStyles.warning.text].join(" "),
    to: "/pwa/pengajuan/lembur",
  },
  {
    icon: Palmtree,
    title: "Cuti Tahunan",
    subtitle: "Cuti reguler & besar",
    containerClass: "bg-primary/10 text-foreground border-border",
    iconClass: "bg-primary/10 text-foreground",
    to: "/pwa/pengajuan/cuti",
  },
  {
    icon: FileText,
    title: "Izin",
    subtitle: "Izin tidak masuk",
    containerClass: [statusStyles.neutral.bg, statusStyles.neutral.border].join(" "),
    iconClass: [statusStyles.neutral.bg, statusStyles.neutral.text].join(" "),
    to: "/pwa/pengajuan/izin",
  },
];

// ── Recent Requests (from store) ──────────────────────────────
const typeLabel: Record<string, string> = {
  sick: "Izin Sakit",
  vacation: "Cuti Tahunan",
  personal: "Izin Pribadi",
  overtime: "Lembur",
};
const statusLabel: Record<string, string> = {
  pending: "Menunggu",
  approved: "Disetujui",
  rejected: "Ditolak",
};

const recentRequests = computed(() =>
  leaveStore.recentRequests.map((req) => ({
    type: typeLabel[req.type] ?? req.type,
    date: new Date(req.createdAt).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    status: req.status,
    statusLabel: statusLabel[req.status] ?? req.status,
  })),
);

function statusStyle(
  status: string,
): { bg: string; text: string; border: string } {
  if (status === "approved") return statusStyles.success;
  if (status === "rejected") return statusStyles.error;
  return statusStyles.warning;
}
</script>

<template>
  <AppPwaLayout>
    <template #title>
      <span class="text-base font-semibold text-foreground">Pengajuan</span>
    </template>
    <template #actions>
      <button
        class="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted/50 transition-colors"
        aria-label="Notifications"
      >
        <Bell class="w-5 h-5 text-foreground" />
        <span
          class="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive"
        />
      </button>
    </template>

    <!-- ── Quick Stats ───────────────────────────────── -->
    <section class="grid grid-cols-2 gap-2 mb-4">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="bg-card rounded-xl border p-3 shadow-sm flex items-center gap-2.5"
        :class="stat.containerClass"
      >
        <div
          class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
          :class="stat.iconClass"
        >
          <component :is="stat.icon" class="w-5 h-5" />
        </div>
        <div>
          <p
            class="text-[10px] uppercase tracking-wide text-muted-foreground"
          >
            {{ stat.label }}
          </p>
          <p
            class="text-sm font-bold text-foreground leading-none mt-0.5"
          >
            {{ stat.value }}
          </p>
        </div>
      </div>
    </section>

    <!-- ── Request Type Selector ──────────────────────── -->
    <section class="grid grid-cols-2 gap-2 mb-4">
      <RouterLink
        v-for="card in requestTypes"
        :key="card.title"
        :to="card.to"
        class="bg-card rounded-xl border border-border shadow-sm p-3 flex items-start gap-2.5 hover:shadow-md transition-shadow"
      >
        <div
          class="w-10 h-10 rounded-xl flex items-center justify-center border flex-shrink-0"
          :class="card.containerClass"
        >
          <component :is="card.icon" class="w-5 h-5" />
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-xs font-semibold text-foreground leading-tight">
            {{ card.title }}
          </p>
          <p
            class="text-[10px] text-muted-foreground mt-0.5 leading-tight"
          >
            {{ card.subtitle }}
          </p>
        </div>
        <ChevronRight class="w-4 h-4 text-muted flex-shrink-0 mt-1" />
      </RouterLink>
    </section>

    <!-- ── Recent Requests ────────────────────────────── -->
    <section>
      <div class="flex justify-between items-center mb-2 px-1">
        <h3 class="text-sm font-semibold text-foreground">
          Pengajuan Terkini
        </h3>
        <button class="text-xs text-foreground font-medium">
          Lihat Semua
        </button>
      </div>
      <div
        class="bg-card rounded-xl border border-border shadow-sm overflow-hidden divide-y divide-border"
      >
        <div
          v-for="req in recentRequests"
          :key="req.type + req.date"
          class="flex items-center gap-3 p-3"
        >
          <div class="flex-1">
            <p class="text-sm font-medium text-foreground">
              {{ req.type }}
            </p>
            <p class="text-xs text-muted-foreground">{{ req.date }}</p>
          </div>
          <span
            class="px-2.5 py-0.5 rounded-full text-xs font-medium border"
            :class="[statusStyle(req.status).bg, statusStyle(req.status).text, statusStyle(req.status).border].join(' ')"
          >
            {{ req.statusLabel }}
          </span>
        </div>
      </div>
    </section>
  </AppPwaLayout>
</template>
