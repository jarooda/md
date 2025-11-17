<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  showEditor: boolean
}>()

const emit = defineEmits<{
  'update:showEditor': [value: boolean]
}>()

const isEditorActive = computed(() => props.showEditor)

const setEditor = () => {
  emit('update:showEditor', true)
}

const setPreview = () => {
  emit('update:showEditor', false)
}
</script>

<template>
  <div
    class="md:hidden bg-gray-100 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700 p-3 flex items-center justify-between gap-2"
  >
    <!-- Toggle Buttons -->
    <div class="flex items-center gap-2">
      <button
        @click="setEditor"
        :class="[
          'px-4 py-2 rounded-lg font-medium transition-colors',
          isEditorActive
            ? 'bg-blue-500 text-white'
            : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600',
        ]"
      >
        Editor
      </button>
      <button
        @click="setPreview"
        :class="[
          'px-4 py-2 rounded-lg font-medium transition-colors',
          !isEditorActive
            ? 'bg-blue-500 text-white'
            : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600',
        ]"
      >
        Preview
      </button>
    </div>

    <!-- Actions Slot -->
    <div class="flex items-center gap-2">
      <slot />
    </div>
  </div>
</template>
