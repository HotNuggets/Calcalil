import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  preview: {
    port: 5173,
  },
  // Add this fallback configuration
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
      },
    },
  },
})