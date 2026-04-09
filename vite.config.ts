import { resolve } from 'node:path'
import { defineConfig } from 'vite'

const googleTagScript = {
  tag: 'script',
  attrs: {
    async: true,
    src: 'https://www.googletagmanager.com/gtag/js?id=G-TJXMD0CGC7',
  },
  injectTo: 'head',
} as const

const googleTagInlineScript = {
  tag: 'script',
  children: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

gtag('config', 'G-TJXMD0CGC7');`,
  injectTo: 'head',
} as const

export default defineConfig(() => ({
  plugins: [
    {
      name: 'inject-google-tag-on-build',
      apply: 'build',
      transformIndexHtml: {
        order: 'pre',
        handler: () => [googleTagScript, googleTagInlineScript],
      },
    },
  ],
  build: {
    rollupOptions: {
      input: {
        home: resolve(__dirname, 'index.html'),
        contact: resolve(__dirname, 'contact/index.html'),
        privacy: resolve(__dirname, 'privacy/index.html'),
      },
    },
  },
}))
