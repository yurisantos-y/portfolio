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
    // Improve build stability
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false,
        drop_debugger: true,
      },
      format: {
        comments: false,
      },
    },
    rollupOptions: {
      output: {
        // More conservative chunk splitting to prevent TDZ issues
        manualChunks: (id) => {
          // Vendor libraries - keep them separate and stable
          if (id.includes('node_modules')) {
            if (id.includes('vue') && (id.includes('vue/') || id.includes('vue-router'))) {
              return 'vendor-vue';
            }
            if (id.includes('@supabase') || id.includes('supabase')) {
              return 'vendor-supabase';
            }
            if (id.includes('date-fns')) {
              return 'vendor-date';
            }
            // Split CKEditor into its own large chunk
            if (id.includes('@ckeditor') || id.includes('ckeditor')) {
              return 'vendor-ckeditor';
            }
            if (id.includes('vue-i18n') || id.includes('@intlify')) {
              return 'vendor-i18n';
            }
            // Other node_modules go to vendor
            return 'vendor';
          }
          
          // Keep auth-related code together to prevent circular dependency issues
          if (id.includes('composables/useAuth') || 
              id.includes('composables/useSupabaseAuth') || 
              id.includes('services/auth') || 
              id.includes('utils/supabaseClient')) {
            return 'auth-core';
          }
          
          // Admin views
          if (id.includes('/admin/') || id.includes('AdminView')) {
            return 'admin';
          }
          
          // Auth views (separate from core auth logic)
          if (id.includes('login') || id.includes('LoginForm') || id.includes('LoginView')) {
            return 'auth-ui';
          }
          
          // Blog related
          if (id.includes('Blog')) {
            return 'blog';
          }
        },
        // Ensure proper module format
        format: 'es',
        // Better chunk file naming
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId ? chunkInfo.facadeModuleId.split('/').pop() : 'chunk';
          return `assets/${facadeModuleId}-[hash].js`;
        },
      }
    },
    chunkSizeWarningLimit: 1500 // Increase limit for CKEditor
  }
})
