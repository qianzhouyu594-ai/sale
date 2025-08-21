import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx(), vueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 3000,

    proxy: {
      // 将所有API请求代理到本地后端服务器
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      '/auth': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      // 话术相关的接口
      '/getprompt': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      '/submitprompt': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      '/analyze': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
})
