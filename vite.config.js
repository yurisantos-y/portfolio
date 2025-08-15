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
    // Improve build stability and prevent TDZ issues
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false,
        drop_debugger: true,
        // Prevent aggressive optimizations that can cause TDZ
        hoist_vars: false,
        hoist_funs: false,
        sequences: false
      },
      format: {
        comments: false,
      },
      mangle: {
        // Prevent variable name mangling that can cause scoping issues
        keep_fnames: true,
        reserved: ['supabaseClient', 'createClient', 'useSupabaseAuth']
      }
    },
    rollupOptions: {
      output: {
        // Conservative chunk splitting to prevent dependency issues
        manualChunks: (id) => {
          // Keep Supabase and auth code together to prevent circular dependencies
          if (id.includes('@supabase') || 
              id.includes('supabaseClient') || 
              id.includes('supabaseFactory') ||
              id.includes('useSupabaseAuth') ||
              id.includes('useAuth') ||
              id.includes('services/auth')) {
            return 'supabase-auth';
          }
          
          // Vue core
          if (id.includes('node_modules/vue/') || id.includes('node_modules/@vue/')) {
            return 'vendor-vue';
          }
          
          // Vue Router
          if (id.includes('vue-router')) {
            return 'vendor-router';
          }
          
          // Internationalization
          if (id.includes('vue-i18n') || id.includes('@intlify')) {
            return 'vendor-i18n';
          }
          
          // CKEditor (large dependency)
          if (id.includes('@ckeditor') || id.includes('ckeditor')) {
            return 'vendor-ckeditor';
          }
          
          // Other vendor dependencies
          if (id.includes('node_modules')) {
            return 'vendor';
          }
          
          // Admin components
          if (id.includes('/admin/') || id.includes('AdminView')) {
            return 'admin';
          }
          
          // Login components
          if (id.includes('login') || id.includes('LoginForm') || id.includes('LoginView')) {
            return 'auth-ui';
          }
          
          // Blog components
          if (id.includes('Blog')) {
            return 'blog';
          }
        },
        // Ensure proper initialization order
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      },
      // External dependencies that should not be bundled
      external: [],
      // Ensure proper module resolution
      preserveEntrySignatures: 'strict'
    },
    // Target modern browsers to avoid compatibility issues
    target: 'es2020',
    chunkSizeWarningLimit: 1500
  }
})
