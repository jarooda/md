<script setup lang="ts">
defineProps<{
  title: string
}>()

defineSlots<{
  default?: () => any
}>()
</script>

<template>
  <div
    class="p-4 bg-gray-100 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700 flex items-center justify-between gap-4"
  >
    <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-200 shrink-0">
      {{ title }}
    </h2>
    <div class="flex items-center gap-2 shrink-0">
      <slot />
    </div>
  </div>
</template>
