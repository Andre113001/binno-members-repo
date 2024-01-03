import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    mainFields: [],
  },

  server: {
    port: 3300,
    proxy: {
      '/api': 'http://localhost:3200'
    },
    host: true
  },
})
