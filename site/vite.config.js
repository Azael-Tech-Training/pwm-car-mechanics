import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/presentation': {
        target: 'http://localhost:3030',
        changeOrigin: true,
        ws: true,
      },
      '/@server-reactive': {
        target: 'http://localhost:3030',
        changeOrigin: true,
      },
      '/@server-ref': {
        target: 'http://localhost:3030',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: resolve(__dirname, '../dist'),
    emptyOutDir: true,
  },
})
