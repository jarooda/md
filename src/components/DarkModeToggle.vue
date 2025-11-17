<script setup lang="ts">
import { useStorage } from '@vueuse/core'
import { watch, onMounted } from 'vue'
import SunIcon from './icons/SunIcon.vue'
import MoonIcon from './icons/MoonIcon.vue'

const isDarkMode = useStorage('dark-mode', false)

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
}

// Apply dark mode class to document
const applyDarkMode = (dark: boolean) => {
  if (dark) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

// Watch for changes
watch(
  isDarkMode,
  (newValue) => {
    applyDarkMode(newValue)
  },
  { immediate: false },
)

// Apply on mount
onMounted(() => {
  applyDarkMode(isDarkMode.value)
})
</script>

<template>
  <button
    @click.stop="toggleDarkMode"
    class="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors inline-flex items-center justify-center"
    :aria-label="isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'"
  >
    <SunIcon v-if="isDarkMode" class="w-5 h-5 text-gray-600 dark:text-gray-300" />
    <MoonIcon v-else class="w-5 h-5 text-gray-600" />
  </button>
</template>
