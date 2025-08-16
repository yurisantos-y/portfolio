import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 5173,
    host: true,
    cors: true,
    headers: {
      'Cross-Origin-Embedder-Policy': 'unsafe-none',
      'Cross-Origin-Opener-Policy': 'same-origin'
    }
  },
  define: {
    global: 'globalThis',
  },
  build: {
    // Use esbuild for more stable minification
    minify: 'esbuild',
    // Prevent TDZ issues with conservative settings
    target: 'es2020',
    sourcemap: false,
    rollupOptions: {
      output: {
        // Simplified chunk splitting to prevent dependency issues
        manualChunks: {
          // Core Vue
          'vendor-vue': ['vue'],
          // Vue Router
          'vendor-router': ['vue-router'],
          // Vue I18n
          'vendor-i18n': ['vue-i18n'],
          // Supabase
          'vendor-supabase': ['@supabase/supabase-js'],
          // CKEditor
          'vendor-ckeditor': ['@ckeditor/ckeditor5-build-classic', '@ckeditor/ckeditor5-vue']
        },
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    // Target modern browsers to avoid compatibility issues
    chunkSizeWarningLimit: 1500
  }
})
