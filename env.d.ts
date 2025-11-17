/// <reference types="vite/client" />

// Missing types for vite-plugin-vue-devtools
declare module 'vite-plugin-vue-devtools' {
  import type { Plugin } from 'vite'
  const plugin: () => Plugin
  export default plugin
}
