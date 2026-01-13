<template>
  <div id="app">
    <!-- 메인 앱 (로그인 화면 포함 모든 라우트 뷰) -->
    <div class="main-app">
      <!-- 메인 콘텐츠 영역 -->
      <main :class="contentClass">
        <router-view v-slot="{ Component }: { Component: any }">
          <component 
            :is="Component" 
            @logout="handleLogout" 
            @request-logout="handleLogoutClick"
            @login-success="handleLoginSuccess"
          />
        </router-view>
      </main>
      
      <!-- 탭 네비게이션 (로그인 화면이 아닐 때만 표시) -->
      <!-- 탭 네비게이션 (로그인 화면이 아닐 때만 표시) -->
      <div v-if="showTabs" class="fixed bottom-0 z-20 w-full h-[48px] bg-white/90 backdrop-blur-md border-t border-slate-200/80 shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.03)] px-3 flex items-center justify-between transition-all duration-300">
        <div class="flex items-center h-full gap-1.5 overflow-x-auto no-scrollbar mask-gradient-r">
          <div
            v-for="tab in tabs"
            :key="tab.name"
            :class="[
              'flex items-center justify-center gap-2 px-3 h-[38px] rounded-lg cursor-pointer text-[13px] font-medium transition-all duration-200 select-none whitespace-nowrap',
              currentRouteName === tab.name 
                ? 'bg-blue-50/80 text-blue-600 shadow-sm ring-1 ring-blue-100' 
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900 active:bg-slate-200'
            ]"
            @click="handleTabClick(tab.name)"
            :title="tab.label"
          >
            <!-- 아이콘: 항상 표시 (스타일 개선) -->
            <span class="material-icons text-[18px] opacity-90">{{ tab.icon }}</span>
            <!-- 라벨: 1200px 이상에서만 표시 -->
            <span class="hidden xl:block tracking-tight">{{ tab.label }}</span>
          </div>
        </div>
        
        <!-- Language Switcher -->
        <div class="flex items-center pl-2 ml-2 border-l border-slate-200 h-[24px] gap-2">
          <LanguageSwitcher :direction="'up'" />
          
           <!-- 로그아웃 버튼 (로그인 모드에서만 표시) -->
           <BaseButton 
            v-if="requiresAuth"
            class="group bg-white hover:bg-red-50 text-slate-600 hover:text-red-600 border border-slate-200 hover:border-red-200 shadow-sm hover:shadow" 
            variant="secondary"
            size="sm"
            rounded="full"
            @click="handleLogoutClick"
            title="로그아웃"
          >
            <div class="flex items-center gap-1.5">
              <span class="material-icons text-[18px] text-slate-400 transition-transform duration-300 group-hover:text-red-500 group-hover:-translate-x-0.5 leading-none">logout</span>
              <span class="hidden sm:inline font-medium text-[13px] leading-none pt-[1px]">{{ $t('common.logout') }}</span>
            </div>
          </BaseButton>
        </div>
      </div>
    </div>
    
    <!-- 로그아웃 모달 (Tailwind Refactors) -->
    <BaseModal 
      v-if="requiresAuth"
      v-model="showLogoutConfirmModal"
      size="sm"
      :show-close-button="false"
      class="max-w-md"
    >
        <!-- 1단계: 로그아웃 확인 -->
        <div v-if="!isLogoutProcessing" class="p-4 text-center">
          <div class="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span class="material-icons text-3xl">logout</span>
          </div>
          <h3 class="text-2xl font-bold text-slate-900 mb-2">{{ $t('auth.logoutConfirmTitle') }}</h3>
          <p class="text-slate-500 mb-8 leading-relaxed" v-html="$t('auth.logoutConfirmMessage').replace('{br}', '<br>')">
          </p>
          <div class="flex gap-3">
            <BaseButton 
              class="flex-1 py-3" 
              variant="secondary"
              size="lg"
              rounded="lg"
              @click="closeLogoutConfirmModal"
            >
              {{ $t('common.cancel') }}
            </BaseButton>
            <BaseButton 
              class="flex-1 py-3" 
              variant="danger"
              size="lg"
              rounded="lg"
              shadow="lg"
              @click="confirmLogout"
            >
              {{ $t('common.logout') }}
            </BaseButton>
          </div>
        </div>
        
        <!-- 2단계: 데이터 저장 완료 -->
        <div v-else class="p-6 text-center">
          <div class="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm animate-bounce-short">
            <span class="material-icons text-4xl">check</span>
          </div>
          <h3 class="text-2xl font-bold text-slate-900 mb-2 tracking-tight">{{ $t('auth.savedTitle') }}</h3>
          <p class="text-slate-500 mb-8 leading-relaxed">
            <span v-html="$t('auth.savedMessage').replace('{br}', '<br>')"></span>
          </p>
          
          <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-8 shadow-inner">
            <div class="h-full bg-emerald-500 transition-all duration-300 ease-linear" :style="{ width: timerProgress + '%' }"></div>
          </div>

          <BaseButton 
            class="w-full py-3.5 shadow-lg shadow-blue-500/20" 
            variant="primary"
            size="lg"
            rounded="xl"
            @click="closeLogoutConfirmModal"
          >
            {{ $t('auth.goToLoginNow') }}
          </BaseButton>
        </div>
    </BaseModal>
    
    <!-- Toast Container (Global) -->
    <ToastContainer />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ToastContainer from './components/DataInputVirtualScroll/parts/ToastContainer.vue';
import BaseModal from './components/Common/BaseModal.vue';
import BaseButton from './components/Common/BaseButton.vue';
import LanguageSwitcher from './components/Common/LanguageSwitcher.vue';
import { showConfirmToast } from './components/DataInputVirtualScroll/logic/toast';
import { tokenManager } from './services/authApi';
import { isAuthRequired, logEnvironmentInfo } from './utils/environmentUtils';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from './stores/authStore';
import { useEpidemicStore } from './stores/epidemicStore';
import { USER_ROLES } from './constants';

const { t } = useI18n();
const route = useRoute();

const router = useRouter();
const authStore = useAuthStore();
const epidemicStore = useEpidemicStore(); // store for validation checks

// --- State ---
const isAuthenticated = ref(false);
const currentUser = ref<any>(null);
const isAdmin = ref(false);
const showLogoutConfirmModal = ref(false);
const isLogoutProcessing = ref(false);
const logoutModalTimer = ref<number | null>(null);
const remainingSeconds = ref(1.5);

// Constants
// Constants
const baseTabs = computed(() => [
  { name: 'DataInputVirtual', label: t('nav.dataInput'), icon: 'table_chart' },
  { name: 'PatientCharacteristics', label: t('nav.patientCharacteristics'), icon: 'accessibility_new' },
  { name: 'EpidemicCurve', label: t('nav.epidemicCurve'), icon: 'show_chart' },
  { name: 'ClinicalSymptoms', label: t('nav.clinicalSymptoms'), icon: 'sick' },
  { name: 'CaseControl', label: t('nav.caseControl'), icon: 'compare_arrows' },
  { name: 'CohortStudy', label: t('nav.cohortStudy'), icon: 'groups' },
  { name: 'CaseSeries', label: t('nav.caseSeries'), icon: 'list_alt' },
  { name: 'ReportWriter', label: t('nav.reportWriter'), icon: 'edit_note' },
  { name: 'HomePage', label: t('nav.webpageInfo'), icon: 'info' }
]);


// --- Computeds ---
const requiresAuth = computed(() => isAuthRequired());

const currentRouteName = computed(() => route.name);

const showTabs = computed(() => {
  return currentRouteName.value !== 'Login' && (!requiresAuth.value || isAuthenticated.value);
});

const tabs = computed(() => {
  const tArr = [...baseTabs.value];
  if (requiresAuth.value && isAdmin.value) {
    tArr.push({
      name: 'AdminPanel',
      label: t('nav.adminPanel'),
      icon: 'admin_panel_settings'
    });
  }
  return tArr;
});


const contentClass = computed(() => {
  const classes = ['content'];
  
  if (showTabs.value) {
    classes.push('has-tabs');
  }

  if (['DataInputVirtual', 'ReportWriter', 'UserManual'].includes(currentRouteName.value as string)) {
    classes.push('no-scroll');
  } else {
    classes.push('scrollable');
  }
  
  return classes.join(' ');
});

const timerProgress = computed(() => {
  const totalTime = 1500; // 1.5s
  const elapsed = totalTime - (remainingSeconds.value * 1000);
  return Math.max(0, Math.min(100, (elapsed / totalTime) * 100));
});

// --- Initialization Logic ---
// Run immediately (like created hook)
logEnvironmentInfo();

// --- Initialization Logic ---
// Run immediately (like created hook)
logEnvironmentInfo();

// 항상 초기 인증 상태 복원 시도 (공개 라우트 포함)
updateAuthState();

if (!requiresAuth.value) {
  // 공개 페이지인 경우
  if (!isAuthenticated.value) {
     console.log('🚀 비로그인 모드로 실행됨 (공개 페이지)');
     // 비로그인 상태여도 초기 데이터는 로드 (단, 권한 필요한 데이터는 로드 안됨)
     loadInitialData();
  } else {
     console.log('✅ 공개 페이지지만 로그인 상태임');
     checkAuthAndLoadData();
  }
} else {
  // 인증이 필요한 페이지
  if (isAuthenticated.value) {
    checkAuthAndLoadData();
  } else {
    // 이미 updateAuthState()에서 처리됨, 토큰 없으면 유지
    // 라우터 가드에서 리다이렉트 처리되므로 여기서는 패스
  }
}

// --- Methods ---
async function checkAuthAndLoadData() {
  try {
    const isValid = await tokenManager.validateToken();
    if (isValid) {
      updateAuthState();
      console.log('✅ 토큰 유효 - 로그인 상태 복원됨');
      loadInitialData();
    } else {
      updateAuthState();
      console.log('❌ 토큰 무효 - 로그인 상태 아님');
      if (route.name !== 'Login') {
        router.push({ name: 'Login' });
      }
    }
  } catch (error) {
    console.error('인증 체크 실패:', error);
    updateAuthState(); // Update state even on error (likely false)
    if (isAuthenticated.value) {
      loadInitialData();
    }
  }
}

function loadInitialData() {
  if ((window as any).storeBridge) {
    (window as any).storeBridge.loadInitialData();
    console.log('App.vue created: StoreBridge를 통해 초기 데이터 로드 완료');
  } else {
    // If storeBridge is missing, fallback to explicit load inside components or another store action if needed.
    // The original code dispatched 'loadInitialData' to Vuex root. 
    // In Pinia, we usually call specific store actions.
    // Assuming 'epidemicStore' has 'loadInitialData' (I added it).
    epidemicStore.loadInitialData(); 
    console.log('App.vue created: Pinia Store를 통해 초기 데이터 로드 완료');
  }
}

function updateAuthState() {
  if (!requiresAuth.value) return;
  const token = localStorage.getItem('authToken');
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  
  isAuthenticated.value = !!(token && user && (user.isApproved || user.approved));
  currentUser.value = user;
  isAdmin.value = user && (user.role === USER_ROLES.ADMIN || user.role === USER_ROLES.SUPPORT);
}

async function handleLoginSuccess() {
  console.log('🎉 handleLoginSuccess 호출됨');
  loadInitialData();
  isAuthenticated.value = true;
  const userStr = localStorage.getItem('user');
  const u = userStr ? JSON.parse(userStr) : null;
  currentUser.value = u;
  isAdmin.value = u && (u.role === USER_ROLES.ADMIN || u.role === USER_ROLES.SUPPORT);
  
  router.push({ name: 'DataInputVirtual' });
  
  console.log('로그인 후 상태:', {
    isAuthenticated: isAuthenticated.value,
    currentUser: currentUser.value,
    isAdmin: isAdmin.value
  });
}

async function updateAuthStateAsync() {
  console.log('🔄 updateAuthStateAsync 시작');
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const token = localStorage.getItem('authToken');
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  
  isAuthenticated.value = !!(token && user && (user.isApproved || user.approved));
  currentUser.value = user;
  isAdmin.value = user && (user.role === USER_ROLES.ADMIN || user.role === USER_ROLES.SUPPORT);
  
  console.log('✅ updateAuthStateAsync 완료:', {
    isAuthenticated: isAuthenticated.value,
    currentUser: currentUser.value,
    isAdmin: isAdmin.value
  });
}

function handleLogout() {
  // Always redirect to login on logout, regardless of current page auth requirement
  updateAuthState();
  router.push({ name: 'Login' });
}

function handleLogoutClick() {
  if (requiresAuth.value) {
    showLogoutConfirmModal.value = true;
  }
}

function closeLogoutConfirmModal() {
  showLogoutConfirmModal.value = false;
  isLogoutProcessing.value = false;
  if (logoutModalTimer.value) {
    clearInterval(logoutModalTimer.value);
    logoutModalTimer.value = null;
  }
  remainingSeconds.value = 1.5;
}

async function confirmLogout() {
  try {
    console.log('🚪 로그아웃 시작');
    isLogoutProcessing.value = true;
    
    // Call Pinia action
    await authStore.logout();
    
    await updateAuthStateAsync();
    await nextTick();
    
    console.log('✅ 로그아웃 완료');
    remainingSeconds.value = 1.5;
    startLogoutTimer();
  } catch (error) {
    console.error('❌ 로그아웃 실패:', error);
    showConfirmToast(t('auth.login.errors.logoutError'));
    closeLogoutConfirmModal();
  }
}

function startLogoutTimer() {
  const step = 0.02; // 20ms
  logoutModalTimer.value = window.setInterval(() => {
    remainingSeconds.value = Math.max(0, remainingSeconds.value - step);
    if (remainingSeconds.value <= 0) {
      closeLogoutConfirmModal();
      router.push({ name: 'Login' });
    }
  }, 20);
}

function handleTabClick(routeName: string) {
  if (currentRouteName.value === 'DataInputVirtual' && routeName !== 'DataInputVirtual') {
    // Check validation errors from epidemicStore
    // Setup store access: epidemicStore.validationState.errors
    const validationErrors = epidemicStore.validationState.errors;
    const hasErrors = validationErrors && validationErrors.size > 0;
    
    if (hasErrors) {
      const confirmMessage = t('common.tabChangeConfirm', { count: validationErrors.size });
      showConfirmToast(confirmMessage).then((confirmed) => {
        if (confirmed) {
          router.push({ name: routeName });
        }
      });
    } else {
      router.push({ name: routeName });
    }
  } else {
    router.push({ name: routeName });
  }
}
</script>

<style>
@import './App.css';
</style>
