import './scss/style.scss'
import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import App from './App.vue'
import router from './router'

// Import debug utilities in development
if (import.meta.env.DEV) {
  import('./utils/debug.js').catch(err => {
    console.warn('Debug utilities not loaded:', err)
  })
}

// Import locales
import { pt_BR } from './locale/pt_BR.js'
import { en } from './locale/en.js'

const languages = {
  pt_BR,
  en
}

const i18n = createI18n({
  legacy: false,
  locale: 'pt_BR',
  fallbackLocale: 'pt_BR',
  messages: languages
})

// Create and mount the app
const app = createApp(App)

app.use(i18n)
app.use(router)

app.mount('#app')

// Remove loading class after app is mounted
if (typeof document !== 'undefined') {
  setTimeout(() => {
    document.body.classList.add('app-loaded')
  }, 100)
}
