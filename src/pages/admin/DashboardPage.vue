<template>
  <div class="flex flex-col items-center justify-center py-24 text-center">
    <div class="bg-accent rounded-full p-6 mb-6">
      <LayoutDashboard
        :size="48"
        class="text-muted-foreground"
      />
    </div>
    <h2 class="text-xl font-bold text-foreground mb-2">
      Coming Soon
    </h2>
    <p class="text-muted-foreground max-w-sm">
      Admin dashboard is under development. Check back in a future update.
    </p>
  </div>
</template>

<script setup lang="ts">
import { LayoutDashboard } from 'lucide-vue-next'
</script>
