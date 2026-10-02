import { build } from 'vite'
import react from '@vitejs/plugin-react'
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

// Dedicated build. Does not load or alter the landing Vite configuration.
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = resolve(root, 'artifacts/auth-build')
await build({
  root, configFile: false, plugins: [react()], base: './', publicDir: false,
  build: { outDir, emptyOutDir: true, assetsInlineLimit: Infinity, cssCodeSplit: false,
    rollupOptions: { input: resolve(root, 'auth.html'), output: { inlineDynamicImports: true } },
  },
})
let html = await readFile(resolve(outDir, 'auth.html'), 'utf8')
const script = html.match(/<script[^>]+src="([^\"]+)"[^>]*><\/script>/)
const style = html.match(/<link[^>]+href="([^\"]+\.css)"[^>]*>/)
if (!script || !style) throw new Error('Expected one auth JS and CSS asset')
const js = await readFile(resolve(outDir, script[1]), 'utf8')
const css = await readFile(resolve(outDir, style[1]), 'utf8')
html = html.replace(script[0], () => `<script type="module">${js.replace(/<\/script/gi, '<\\/script')}</script>`)
html = html.replace(style[0], () => `<style>${css}</style>`)
await mkdir(resolve(root, 'artifacts'), { recursive: true })
const destination = resolve(root, 'artifacts/elevenhouse-auth.html')
await writeFile(destination, html)
console.log(`Standalone auth: ${destination} (${Math.round(Buffer.byteLength(html) / 1024)} KB)`)
