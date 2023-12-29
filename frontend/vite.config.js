import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  server: {
    port: 3006,
    proxy: {
      '/api': 'http://localhost:3200'
    },
    host: true
  },
})
