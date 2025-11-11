import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy requests from /temp-api/* to the Node API on port 3001
      '/temp-api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false, // Use false for local development
      }
    }
  }
})
