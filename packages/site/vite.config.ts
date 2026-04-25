import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import prerender from '@prerenderer/rollup-plugin'
import fs from 'node:fs'
import path from 'node:path'
import { listBlogSlugs } from './scripts/list-blog-slugs'

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

async function resolveLaunchOptions() {
  if (process.platform !== 'linux') return undefined
  const chromium = (await import('@sparticuz/chromium')).default
  return {
    args: chromium.args,
    executablePath: await chromium.executablePath(),
    headless: true,
  }
}

export default defineConfig(async () => {
  const launchOptions = await resolveLaunchOptions()

  const blogRoutes = listBlogSlugs().map((entry) => `/blog/${entry.slug}`)

  return {
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
              '/blog',
              ...blogRoutes,
            ],
            renderer: '@prerenderer/renderer-puppeteer',
            rendererOptions: {
              renderAfterTime: 2000,
              headless: true,
              ...(launchOptions ? { launchOptions } : {}),
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
  }
})
