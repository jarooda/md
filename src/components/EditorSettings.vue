<script setup lang="ts">
import { ref } from 'vue'
import { useStorage, onClickOutside } from '@vueuse/core'
import SettingsIcon from './icons/SettingsIcon.vue'

const showSettingsMenu = ref(false)
const settings = useStorage('editor-settings', {
  wordWrap: true,
  syncScroll: false,
})

const settingsMenuRef = ref<HTMLElement | null>(null)
const settingsButtonRef = ref<HTMLElement | null>(null)

const toggleMenu = () => {
  showSettingsMenu.value = !showSettingsMenu.value
}

// Close menu when clicking outside, but ignore clicks on the button
onClickOutside(
  settingsMenuRef,
  () => {
    showSettingsMenu.value = false
  },
  {
    ignore: [settingsButtonRef],
  },
)

defineExpose({
  settings,
})
</script>

<template>
  <div class="relative">
    <!-- Settings Button -->
    <button
      ref="settingsButtonRef"
      @click="toggleMenu"
      class="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
      aria-label="Settings"
    >
      <SettingsIcon class="w-5 h-5 text-gray-600 dark:text-gray-300" />
    </button>

    <!-- Settings Menu -->
    <div
      v-if="showSettingsMenu"
      ref="settingsMenuRef"
      class="absolute top-full right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg z-10 min-w-[200px]"
    >
      <div class="p-3 border-b border-gray-200 dark:border-gray-700">
        <h3 class="font-semibold text-sm text-gray-700 dark:text-gray-200">Editor Settings</h3>
      </div>
      <div class="p-3 space-y-3">
        <label class="flex items-center justify-between cursor-pointer">
          <span class="text-sm text-gray-700 dark:text-gray-300">Word Wrap</span>
          <input
            type="checkbox"
            v-model="settings.wordWrap"
            class="w-4 h-4 text-blue-500 rounded focus:ring-2 focus:ring-blue-500"
          />
        </label>
        <label class="flex items-center justify-between cursor-pointer">
          <span class="text-sm text-gray-700 dark:text-gray-300">Sync Scroll</span>
          <input
            type="checkbox"
            v-model="settings.syncScroll"
            class="w-4 h-4 text-blue-500 rounded focus:ring-2 focus:ring-blue-500"
          />
        </label>
      </div>
    </div>
  </div>
</template>
