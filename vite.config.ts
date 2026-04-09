import { resolve } from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig(() => ({
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
