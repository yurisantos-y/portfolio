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
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor libraries
          if (id.includes('node_modules')) {
            if (id.includes('vue') || id.includes('vue-router')) {
              return 'vendor-vue';
            }
            if (id.includes('@supabase') || id.includes('supabase')) {
              return 'vendor-supabase';
            }
            if (id.includes('date-fns')) {
              return 'vendor-date';
            }
            if (id.includes('@ckeditor') || id.includes('ckeditor')) {
              return 'vendor-ckeditor';
            }
            if (id.includes('vue-i18n') || id.includes('@intlify')) {
              return 'vendor-i18n';
            }
            // Other node_modules go to vendor
            return 'vendor';
          }
          
          // Admin views
          if (id.includes('/admin/') || id.includes('AdminView')) {
            return 'admin';
          }
          
          // Auth related
          if (id.includes('auth') || id.includes('login')) {
            return 'auth';
          }
          
          // Blog related
          if (id.includes('Blog')) {
            return 'blog';
          }
        }
      }
    },
    chunkSizeWarningLimit: 600
  }
})
