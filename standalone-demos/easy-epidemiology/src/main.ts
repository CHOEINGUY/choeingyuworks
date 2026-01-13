// main.ts
import { createApp } from 'vue';
import App from './App.vue';
import { createPinia } from 'pinia';
import router from './router/index'; // Vue Router
import i18n from './i18n'; // i18n configuration
import './assets/styles/tailwind.css'; // Tailwind CSS


import { UserManager } from './auth/UserManager';

// Logger import
import { createComponentLogger } from './utils/logger';

const app = createApp(App);
const pinia = createPinia();
app.use(pinia); // Pinia 연결
app.use(router); // Vue Router 연결
app.use(i18n); // i18n 연결

// Logger 초기화
const logger = createComponentLogger('Main');

// 개발 환경 설정
const isDevelopment = (import.meta as any).env?.MODE === 'development' || false;



// 사용자 관리자 초기화
const userManager = new UserManager();

// 전역 설정

// (window as any).userManager = userManager; // Removed legacy window pollution

// Vuex 호환성 제거됨

// 전역 자동 저장
// GridService 내부에서 처리됨

// 개발 환경에서만 전역 디버깅 객체 노출
if (isDevelopment) {
  (window as any).$debug = {

  };
}

if (isDevelopment) {
  logger.info('Easy-Epidemiology Web v2.0 - Development Mode');
}

// Service Worker 등록 (오프라인 지원)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(registration => {
        logger.info('SW registered: ', registration);
      })
      .catch(registrationError => {
        logger.error('SW registration failed: ', registrationError);
      });
  });
}

app.mount('#app');
