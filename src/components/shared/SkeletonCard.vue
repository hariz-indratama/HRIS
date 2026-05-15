<script setup lang="ts">
/**
 * SkeletonCard.vue
 *
 * Animated pulse skeleton placeholder for loading states.
 * Follows Stitch design token system (stitch-surface-variant background).
 *
 * @packageDocumentation
 */
defineProps<{
  /** Number of text lines to show */
  lines?: number
  /** Show avatar circle at top */
  avatar?: boolean
  /** Compact mode — smaller gaps */
  compact?: boolean
}>()
</script>

<template>
  <div
    class="bg-white rounded-xl border border-stitch-outline-variant shadow-sm p-4 animate-pulse"
  >
    <!-- Avatar skeleton -->
    <div v-if="avatar" class="flex items-center gap-3 mb-3">
      <div class="w-10 h-10 rounded-full bg-stitch-surface-variant" />
      <div class="flex-1 space-y-1.5">
        <div class="h-3 w-2/3 rounded bg-stitch-surface-variant" />
        <div class="h-2.5 w-1/2 rounded bg-stitch-surface-variant" />
      </div>
    </div>

    <!-- Line skeletons -->
    <div :class="compact ? 'space-y-1' : 'space-y-2.5'">
      <div
        v-for="i in (lines ?? 3)"
        :key="i"
        class="h-3 rounded bg-stitch-surface-variant"
        :class="i === (lines ?? 3) ? 'w-3/4' : 'w-full'"
      />
    </div>
  </div>
</template>
