<template>
  <div class="min-h-full flex font-['Noto_Sans_KR',_sans-serif] overflow-x-hidden">
    <!-- Left Side: Branding with HeroSection-style background -->
    <div class="hidden lg:flex flex-1 relative items-center justify-center bg-white overflow-hidden">
      <!-- HeroSection style background -->
      <div class="absolute inset-0 pointer-events-none">
        <div class="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.075)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.1)_1px,transparent_1px)] bg-[length:50px_50px] [mask-image:radial-gradient(circle_at_center,black,transparent_80%)]"></div>
        <div class="absolute -inset-[50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.06),transparent_60%)] animate-heroPulse"></div>
      </div>
      
      <div class="relative z-10 p-12 max-w-[480px] text-center animate-fadeUp">
        <h1 class="text-[3.5rem] font-extrabold leading-[1.2] mb-6 tracking-tight">
          <span class="block text-slate-500 font-medium text-2xl mb-2">Easy</span>
          <span class="block bg-gradient-to-br from-blue-500 to-blue-700 bg-clip-text text-transparent pb-2">Epidemiology</span>
        </h1>
        <p class="text-[1.1rem] text-slate-500 leading-relaxed mb-12" v-html="$t('auth.hero.subtitle').replace('{br}', '<br/>')">
        </p>
        
        <div class="flex flex-col gap-4 text-left">
          <div class="flex items-center gap-3 text-[0.95rem] group">
            <div class="w-11 h-11 bg-slate-100 rounded-xl flex items-center justify-center text-xl text-slate-900 transition-all duration-300 group-hover:bg-slate-900 group-hover:text-white">
              <span class="material-icons">edit_note</span>
            </div>
            <span class="text-slate-600 font-medium tracking-tight">{{ $t('auth.hero.feature1') }}</span>
          </div>
          <div class="flex items-center gap-3 text-[0.95rem] group">
            <div class="w-11 h-11 bg-slate-100 rounded-xl flex items-center justify-center text-xl text-slate-900 transition-all duration-300 group-hover:bg-slate-900 group-hover:text-white">
              <span class="material-icons">bar_chart</span>
            </div>
            <span class="text-slate-600 font-medium tracking-tight">{{ $t('auth.hero.feature2') }}</span>
          </div>
          <div class="flex items-center gap-3 text-[0.95rem] group">
            <div class="w-11 h-11 bg-slate-100 rounded-xl flex items-center justify-center text-xl text-slate-900 transition-all duration-300 group-hover:bg-slate-900 group-hover:text-white">
              <span class="material-icons">science</span>
            </div>
            <span class="text-slate-600 font-medium tracking-tight">{{ $t('auth.hero.feature3') }}</span>
          </div>
        </div>
        
        <!-- Public Access Link -->
        <div class="mt-12 pt-8 border-t border-slate-100/50 flex justify-center lg:justify-start">
          <router-link to="/info" class="inline-flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-all duration-300 text-sm font-medium group">
            <span class="bg-slate-50 p-1.5 rounded-lg group-hover:bg-blue-50 transition-colors">
              <span class="material-icons text-lg group-hover:text-blue-500">space_dashboard</span>
            </span>
            <span>{{ $t('auth.hero.guestAccess') }}</span>
            <span class="material-icons text-sm opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all">arrow_forward</span>
          </router-link>
        </div>
      </div>
    </div>
    
    <!-- Right Side: Auth Form -->
    <div class="flex-1 flex items-center justify-center bg-slate-50/50 p-6 md:p-12 relative overflow-hidden">
      <!-- Decorative background for form side -->
      <div class="absolute top-0 right-0 w-64 h-64 bg-blue-100/30 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
      <div class="absolute bottom-0 left-0 w-64 h-64 bg-violet-100/30 rounded-full blur-3xl -ml-32 -mb-32 pointer-events-none"></div>

      <div class="absolute top-6 right-6 z-50">
        <LanguageSwitcher />
      </div>

      <div class="w-full max-w-[460px] bg-white/80 backdrop-blur-xl p-8 md:p-10 rounded-3.5xl border border-white/40 shadow-glass animate-slideIn relative z-10 transition-all duration-500">
        <AuthHeader :title="showRegister ? $t('auth.registerTitle') : $t('auth.title')" />
        <AuthTabs :show-register="showRegister" @update:showRegister="toggleView" />
        
        <div class="mt-8">
          <AuthLogin 
            v-if="!showRegister"
            :is-loading="isLoading"
            :error="error"
            @login="handleLogin"
            @update:error="error = $event"
          />
          
          <AuthRegister 
            v-if="showRegister"
            :is-loading="isLoading"
            :error="error"
            @register="handleRegister"
            @update:error="error = $event"
          />
        </div>
      </div>
    </div>
    
    <RegistrationSuccessModal 
      v-if="showRegistrationSuccess" 
      @close="closeRegistrationSuccess" 
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

import { useAuthStore } from '../../stores/authStore';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

// Parts
import AuthHeader from './parts/AuthHeader.vue';
import AuthTabs from './parts/AuthTabs.vue';
import AuthLogin from './parts/AuthLogin.vue';
import AuthRegister from './parts/AuthRegister/index.vue';
import RegistrationSuccessModal from './parts/RegistrationSuccessModal.vue';
import LanguageSwitcher from '../Common/LanguageSwitcher.vue';

// Emits
const emit = defineEmits<{
  (e: 'login-success'): void;
}>();

// Store
const authStore = useAuthStore();

// State
const showRegister = ref(false);
const isLoading = ref(false);
const error = ref('');
const showRegistrationSuccess = ref(false);

// Watch for auth state changes
watch(() => authStore.isAuthenticated, (newValue, oldValue) => {
  if (oldValue === true && newValue === false) {
    resetState();
  }
});

// Methods
function toggleView(isRegister: boolean) {
  if (showRegister.value !== isRegister) {
    showRegister.value = isRegister;
    resetState();
  }
}

function resetState() {
  error.value = '';
  isLoading.value = false;
}

async function handleLogin(credentials: any) {
  if (isLoading.value) return;
  isLoading.value = true;
  error.value = '';
  
  try {
    // Dispatching directly to Pinia action
    await authStore.login(credentials);
    await new Promise(resolve => setTimeout(resolve, 100)); // wait for 100ms
    emit('login-success');
  } catch (err: any) {
    const msg = err.message || '';
    if (msg.includes('Invalid credentials:')) {
      error.value = t('auth.errors.invalidCredentials');
    } else if (msg.includes('User not found:')) {
      error.value = t('auth.errors.userNotFound');
    } else if (msg.includes('Account not approved:')) {
      error.value = t('auth.errors.accountNotApproved');
    } else if (msg.includes('Network')) {
      error.value = t('auth.errors.networkConnection');
    } else {
      error.value = t('auth.errors.loginError');
    }
  } finally {
    isLoading.value = false;
  }
}

async function handleRegister(registerData: any) {
  if (isLoading.value) return;
  isLoading.value = true;
  error.value = '';
  
  try {
    await authStore.register(registerData);
    showRegistrationSuccess.value = true;
  } catch (err: any) {
    const msg = err.message || '';
    if (msg.includes('Email already exists')) {
      error.value = t('auth.errors.emailExists');
    } else if (msg.includes('Phone already exists')) {
      error.value = t('auth.errors.phoneExists');
    } else {
      error.value = t('auth.errors.unknown', { msg });
    }
  } finally {
    isLoading.value = false;
  }
}

function closeRegistrationSuccess() {
  showRegistrationSuccess.value = false;
  showRegister.value = false;
  resetState();
}
</script>

<style scoped>
/* All styles handled via Tailwind */
</style>
