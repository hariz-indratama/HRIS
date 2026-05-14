<template>
  <div class="flex flex-col items-center justify-center py-24 text-center">
    <div class="bg-accent rounded-full p-6 mb-6">
      <Calendar
        :size="48"
        class="text-muted-foreground"
      />
    </div>
    <h2 class="text-xl font-bold text-foreground mb-2">
      Coming Soon
    </h2>
    <p class="text-muted-foreground max-w-sm">
      Leave request management is under development. Check back in a future update.
    </p>
  </div>
</template>

<script setup lang="ts">
import { Calendar } from 'lucide-vue-next'
</script>
