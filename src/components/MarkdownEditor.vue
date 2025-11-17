<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue'
import { useStorage } from '@vueuse/core'
import { EditorView, basicSetup } from 'codemirror'
import { markdown } from '@codemirror/lang-markdown'
import { languages } from '@codemirror/language-data'
import { syntaxHighlighting, HighlightStyle } from '@codemirror/language'
import { tags } from '@lezer/highlight'
import { marked } from 'marked'
import Prism from 'prismjs'
import PanelHeader from './PanelHeader.vue'
import DarkModeToggle from './DarkModeToggle.vue'
import EditorSettings from './EditorSettings.vue'
import MobileHeader from './MobileHeader.vue'

// Import Prism languages
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-scss'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-markdown'
import 'prismjs/components/prism-yaml'
import 'prismjs/components/prism-sql'
import 'prismjs/components/prism-go'
import 'prismjs/components/prism-rust'
import 'prismjs/components/prism-java'

// Create custom highlight style for markdown links
const markdownHighlightStyle = HighlightStyle.define([
  { tag: tags.link, class: 'cm-link' },
  { tag: tags.url, class: 'cm-url' },
])

const editorElement = ref<HTMLDivElement | null>(null)
const editorView = ref<EditorView | null>(null)
const previewElement = ref<HTMLDivElement | null>(null)
const editorSettingsRef = ref<InstanceType<typeof EditorSettings> | null>(null)

// Mobile view toggle: true = editor, false = preview
const showEditor = ref(true)

// Track dark mode
const isDarkMode = useStorage('dark-mode', false)

// Store markdown content in localStorage
const markdownContent = useStorage(
  'markdown-content',
  '# Welcome to Markdown Editor\n\nStart writing your markdown here...\n\n## Features\n- Live preview\n- Local storage persistence\n- CodeMirror editor\n- Syntax highlighting with Prism\n\n**Happy writing!**\n\n```javascript\nconst greeting = "Hello, World!";\nconsole.log(greeting);\n```',
)

const htmlPreview = ref('')

// Configure marked with custom renderer for code blocks
const renderer = new marked.Renderer()
renderer.code = ({ text, lang }: { text: string; lang?: string }) => {
  const language = lang || 'plaintext'
  const validLanguage = language && Prism.languages[language] ? language : 'plaintext'
  const grammar = Prism.languages[validLanguage]
  const highlighted = grammar ? Prism.highlight(text, grammar, validLanguage) : text

  return `<pre><code class="language-${validLanguage}">${highlighted}</code></pre>`
}

marked.setOptions({
  breaks: true,
  gfm: true,
  renderer: renderer,
})

// Update preview when content changes
const updatePreview = async (content: string) => {
  htmlPreview.value = marked.parse(content) as string
  await nextTick()
  // Highlight inline code if needed
  if (previewElement.value) {
    Prism.highlightAllUnder(previewElement.value)
  }
}

// Get editor extensions based on settings
const getEditorExtensions = () => {
  const extensions = [
    basicSetup,
    markdown({
      codeLanguages: languages,
    }),
    syntaxHighlighting(markdownHighlightStyle),
    EditorView.updateListener.of((update) => {
      if (update.docChanged) {
        const content = update.state.doc.toString()
        markdownContent.value = content
      }
    }),
  ]

  // Add word wrap if enabled
  if (editorSettingsRef.value?.settings.wordWrap) {
    extensions.push(EditorView.lineWrapping)
  }

  // Add dark theme using Tailwind colors
  if (isDarkMode.value) {
    extensions.push(
      EditorView.theme({
        '&': {
          backgroundColor: 'rgb(15 23 42)', // slate-900
          color: 'rgb(226 232 240)', // slate-200
        },
        '.cm-content': {
          caretColor: 'rgb(226 232 240)', // slate-200
        },
        '.cm-cursor, .cm-dropCursor': {
          borderLeftColor: 'rgb(226 232 240)', // slate-200
        },
        '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection': {
          backgroundColor: 'rgb(51 65 85)', // slate-700
        },
        '.cm-activeLine': {
          backgroundColor: 'rgb(30 41 59)', // slate-800
        },
        '.cm-gutters': {
          backgroundColor: 'rgb(15 23 42)', // slate-900
          color: 'rgb(148 163 184)', // slate-400
          borderRight: '1px solid rgb(51 65 85)', // slate-700
        },
        '.cm-activeLineGutter': {
          backgroundColor: 'rgb(30 41 59)', // slate-800
        },
      }),
    )
  }

  return extensions
}

onMounted(() => {
  if (!editorElement.value) return

  // Initialize CodeMirror
  editorView.value = new EditorView({
    doc: markdownContent.value,
    extensions: getEditorExtensions(),
    parent: editorElement.value,
  })

  // Initial preview
  updatePreview(markdownContent.value)
})

// Update editor word wrap when setting changes
watch(
  () => editorSettingsRef.value?.settings.wordWrap,
  (newValue) => {
    if (!editorView.value || newValue === undefined) return

    const currentDoc = editorView.value.state.doc.toString()

    // Recreate editor with new settings
    editorView.value.destroy()
    editorView.value = new EditorView({
      doc: currentDoc,
      extensions: getEditorExtensions(),
      parent: editorElement.value!,
    })
  },
)

// Update editor theme when dark mode changes
watch(isDarkMode, () => {
  if (!editorView.value) return

  const currentDoc = editorView.value.state.doc.toString()

  // Recreate editor with new theme
  editorView.value.destroy()
  editorView.value = new EditorView({
    doc: currentDoc,
    extensions: getEditorExtensions(),
    parent: editorElement.value!,
  })
})

// Watch for changes in markdown content and update preview
watch(markdownContent, (newContent) => {
  updatePreview(newContent)
})
</script>

<template>
  <div class="flex flex-col h-screen w-full">
    <!-- Mobile Header (visible on mobile only) -->
    <MobileHeader v-model:show-editor="showEditor">
      <EditorSettings ref="editorSettingsRef" />
      <DarkModeToggle />
    </MobileHeader>

    <!-- Main Content Area -->
    <div class="flex flex-1 overflow-hidden">
      <!-- Editor Panel -->
      <div
        :class="[
          'border-r border-gray-300 dark:border-gray-700 overflow-hidden',
          'md:w-1/2',
          showEditor ? 'w-full' : 'hidden md:block',
        ]"
      >
        <div class="hidden md:block">
          <PanelHeader title="Editor">
            <EditorSettings ref="editorSettingsRef" />
          </PanelHeader>
        </div>
        <div ref="editorElement" class="h-full md:h-[calc(100%-60px)] overflow-auto"></div>
      </div>

      <!-- Preview Panel -->
      <div
        :class="[
          'overflow-hidden bg-white dark:bg-gray-900',
          'md:w-1/2',
          !showEditor ? 'w-full' : 'hidden md:block',
        ]"
      >
        <div class="hidden md:block">
          <PanelHeader title="Preview">
            <DarkModeToggle />
          </PanelHeader>
        </div>
        <div
          ref="previewElement"
          class="prose prose-lg dark:prose-invert max-w-none p-6 h-full md:h-[calc(100%-60px)] overflow-auto"
          v-html="htmlPreview"
        ></div>
      </div>
    </div>
  </div>
</template>
<style scoped>
/* CodeMirror custom styling */
:deep(.cm-editor) {
  height: 100%;
  font-size: 14px;
}

:deep(.cm-scroller) {
  overflow: auto;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}

:deep(.cm-content) {
  padding: 1rem;
}

:deep(.cm-line) {
  line-height: 1.6;
}

/* Link styling */
:deep(.cm-link) {
  color: #3b82f6; /* blue-500 for light mode */
  text-decoration: underline;
}

:deep(.cm-url) {
  color: #3b82f6; /* blue-500 for light mode */
  text-decoration: underline;
}

/* Dark mode link styling */
.dark :deep(.cm-link),
.dark :deep(.cm-url) {
  color: #60a5fa; /* blue-400 for dark mode */
}
</style>
