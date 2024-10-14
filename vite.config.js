import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // server: { https: true },
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://aniwatch-api-v2-iota.vercel.app/api/v2/hianime',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
