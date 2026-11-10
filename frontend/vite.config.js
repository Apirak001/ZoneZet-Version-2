import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  },
  build: {
    // Vercel's Output Directory setting expects "dist" at the repository root
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('recharts') || id.includes('d3-') || id.includes('victory-vendor')) {
              return 'recharts-vendor';
            }
            if (id.includes('lucide-react') || id.includes('lenis')) {
              return 'ui-vendor';
            }
            if (id.includes('react-dom') || id.includes('react') || id.includes('scheduler')) {
              return 'react-vendor';
            }
          }
        }
      }
    }
  }
})
