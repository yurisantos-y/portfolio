import './scss/style.scss';
import { createApp } from 'vue';
import { createI18n } from 'vue-i18n';
import App from './App.vue';
import router from './router';

// Import debug utilities in development
if (import.meta.env.DEV) {
  import('./utils/debug.js').catch(err => {
    console.warn('Debug utilities not loaded:', err);
  });
}

// Import locales
import { pt_BR } from '../src/locale/pt_BR.js';
import { en } from '../src/locale/en.js';

const languages = {
  pt_BR,
  en
};

const i18n = createI18n({
  legacy: false,
  locale: 'pt_BR',
  fallbackLocale: 'pt_BR',
  messages: languages
});

// Ensure DOM is ready before creating the app
function initializeApp() {
  const app = createApp(App);

  app.use(i18n);
  app.use(router);

  // Mount the app
  app.mount('#app');

  // Remove loading class after app is mounted
  if (typeof document !== 'undefined') {
    setTimeout(() => {
      document.body.classList.add('app-loaded');
    }, 100);
  }
}

// Initialize app when DOM is ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
  } else {
    // DOM is already ready
    initializeApp();
  }
} else {
  // SSR environment
  initializeApp();
}
