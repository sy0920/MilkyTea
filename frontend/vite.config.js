import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    uni.default(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
