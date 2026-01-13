import { createI18n } from 'vue-i18n';
import ko from './locales/ko';
import en from './locales/en';

const savedLocale = localStorage.getItem('user-locale') || 'ko';

const i18n = createI18n({
  legacy: false, // Vue 3 Composition API mode
  locale: savedLocale, // default locale
  fallbackLocale: 'en',
  globalInjection: true, // inject $t globally
  warnHtmlMessage: false, // disable warnings for HTML in translation keys
  messages: {
    ko,
    en
  }
});

export default i18n;
