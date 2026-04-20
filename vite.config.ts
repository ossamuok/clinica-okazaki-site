import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import prerender from '@prerenderer/rollup-plugin'
import fs from 'node:fs'
import path from 'node:path'

let homeHtml: string | null = null

const saveHomeHtml: Plugin = {
  name: 'save-home-html',
  closeBundle() {
    if (homeHtml) {
      const outPath = path.resolve(__dirname, 'dist/index.html')
      fs.writeFileSync(outPath, homeHtml)
    }
  },
}

export default defineConfig({
  plugins: [react(), saveHomeHtml],
  build: {
    rollupOptions: {
      plugins: [
        prerender({
          routes: [
            '/',
            '/endoscopia',
            '/colonoscopia',
            '/preparo-endoscopia',
            '/preparo-colonoscopia',
            '/gastroenterologia',
            '/hepatologia',
            '/geriatria',
          ],
          renderer: '@prerenderer/renderer-puppeteer',
          rendererOptions: {
            renderAfterTime: 2000,
            headless: true,
          },
          postProcess(renderedRoute) {
            if (renderedRoute.route === '/') {
              homeHtml = renderedRoute.html
            }
          },
        }),
      ],
    },
  },
})
