import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/uploads': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
        headers: {
          'Cross-Origin-Resource-Policy': 'cross-origin'
        }
      }
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['react-icons', 'react-hot-toast'],
          markdown: ['react-markdown', '@uiw/react-md-editor', 'react-syntax-highlighter'],
          charts: ['recharts'],
          utils: ['axios', 'moment', 'clsx']
        }
      }
    },
    // Optimized for deployment
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1600,
    // Optimize for production
    target: 'esnext',
    reportCompressedSize: false
  },
  // Define global constants for production
  define: {
    __PRODUCTION__: JSON.stringify(mode === 'production')
  },
  // Base URL for deployment - use absolute paths for Render
  base: '/'
}))
