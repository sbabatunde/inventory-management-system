import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: 3000, // Change 3000 to whatever port you want
    strictPort: true, // Optional: fails if port 3000 is already in use instead of auto-incrementing
  },
})