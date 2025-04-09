import './scss/style.scss';
import { createApp } from 'vue';
import { createI18n } from 'vue-i18n';
import App from './App.vue';
import router from './router';

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

const app = createApp(App);

app.use(i18n);
app.use(router);

app.mount('#app');
