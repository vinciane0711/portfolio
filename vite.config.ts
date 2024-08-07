import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import dsv from '@rollup/plugin-dsv'
import vue from '@vitejs/plugin-vue'
import Icons from 'unplugin-icons/vite'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/portfolio/',
  build: {
    target: 'esnext', //browsers can handle the latest ES features
  },
  plugins: [vue(), dsv(), Icons({ compiler: 'vue3' })],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
