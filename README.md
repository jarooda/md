# MD — Minimal Markdown Editor (Vue + CodeMirror)

A fast, minimalist Markdown editor with live preview, mobile-friendly layout, dark mode, and CodeMirror 6 editing. It uses Prism for code block highlighting and persists your content locally so you can pick up where you left off.

## Features

- Live Markdown editing with CodeMirror 6
- Sane defaults via basicSetup and markdown language support
- Syntax-highlighted code blocks in preview (PrismJS)
- Custom link coloring in the editor using CodeMirror class highlighter
- Dark mode toggle (persists between sessions)
- Optional word wrap
- Mobile header with Editor/Preview toggle
- Local storage persistence for content and settings
- Tailwind CSS + Typography for clean, readable preview

## Tech Stack

- Vue 3 + TypeScript + Vite
- CodeMirror 6 (`codemirror`, `@codemirror/lang-markdown`, `@codemirror/language-data`)
- class-based styling for tokens via `@codemirror/language` + `@lezer/highlight`
- PrismJS for code blocks in preview
- marked for markdown rendering
- Tailwind CSS v4 + Typography plugin
- @vueuse/core for storage and UX utilities

## Quick Start

Requirements:

- Node.js: ^20.19.0 or >=22.12.0 (see `package.json > engines`)
- pnpm

Install and run:

```sh
pnpm install
pnpm dev
```

Build for production:

```sh
pnpm build
```

Preview production build:

```sh
pnpm preview
```

## Scripts

- `pnpm dev` — Start Vite dev server
- `pnpm build` — Type-check + build
- `pnpm preview` — Preview the production build
- `pnpm type-check` — Run `vue-tsc --build`
- `pnpm test:unit` — Run unit tests with Vitest
- `pnpm lint` — Lint with ESLint (fix + cache)
- `pnpm format` — Format source files with Prettier

## Project Structure

```
src/
  App.vue                  # Shell that renders the editor
  main.ts                  # App bootstrap
  assets/styles/main.css   # Tailwind entry
  components/
    MarkdownEditor.vue     # Core editor + preview logic
    EditorSettings.vue     # Word wrap toggle (persisted)
    DarkModeToggle.vue     # Dark mode toggle (persisted)
    MobileHeader.vue       # Mobile-only header with view toggle
    PanelHeader.vue        # Section header with slot for actions
    icons/                 # SVG icon components
```

## How it Works

- Editor: CodeMirror 6 with `basicSetup` and the Markdown language. Content changes are mirrored into local storage so they persist across reloads.
- Preview: The markdown is rendered with `marked`, then code blocks are highlighted with Prism via `Prism.highlightAllUnder`.
- Dark mode: Toggled via a small component that adds/removes the `dark` class on `<html>`, which Tailwind uses to switch themes.
- Word wrap: An option in `EditorSettings` toggles CodeMirror's `EditorView.lineWrapping`.

### Link color in CodeMirror (classHighlighter)

This project uses CodeMirror’s class-based highlighting to style markdown links consistently.

- In `MarkdownEditor.vue`, we define a `HighlightStyle` and register it:
  - `tags.link` → `.cm-link`
  - `tags.url` → `.cm-url`
- We apply it via `syntaxHighlighting(markdownHighlightStyle)` in the editor extensions.
- Then we style those classes in the component’s `<style>` block:
  - Light: `#3b82f6` (Tailwind blue-500)
  - Dark: `#60a5fa` (Tailwind blue-400)

If you want to tweak colors, edit the CSS rules for `.cm-link` and `.cm-url` in `MarkdownEditor.vue`.

## Testing & Linting

Run unit tests (Vitest + Vue Test Utils + jsdom):

```sh
pnpm test:unit
```

Type-check:

```sh
pnpm type-check
```

Lint:

```sh
pnpm lint
```

## Configuration

- Tailwind configuration: `tailwind.config.ts`
- Vite configuration: `vite.config.ts`
- ESLint: `eslint.config.ts`
- TypeScript: `tsconfig*.json`

## Persistence Keys

- `markdown-content` — The current editor content
- `dark-mode` — Dark mode flag
- `editor-settings` — Editor preferences (e.g., `wordWrap`)

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) with the official [Vue - Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) extension
- Disable Vetur if installed

## Browser DevTools (Optional)

- Chromium-based: [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd) and enable “Custom Object Formatter”
- Firefox: [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/) and enable “Custom Object Formatter”

---

If you run into an issue or have an idea to improve the editor, feel free to open an issue or a PR.
