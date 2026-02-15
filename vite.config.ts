import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages base URL: Update this if deploying to a user/org page or custom domain
  base: '/human-performance-index/',
})
