<script setup lang="ts">
import { RouterView } from 'vue-router'
import { Sonner } from '@/components/ui/sonner'

defineOptions({ inheritAttrs: false })
</script>

<template>
  <RouterView />
  <Sonner />
</template>