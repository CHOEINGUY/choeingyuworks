<template>
  <div class="relative min-h-screen bg-slate-50 font-['Noto_Sans_KR',_sans-serif] overflow-x-hidden transition-colors duration-500 selection:bg-primary-500/20 selection:text-primary-600">
    <!-- Sophisticated Animated Background -->
    <div class="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <div class="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.015)_1.5px,transparent_1.5px),linear-gradient(90deg,rgba(15,23,42,0.015)_1.5px,transparent_1.5px)] bg-[length:60px_60px]"></div>
      <div class="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px] animate-heroPulse"></div>
      <div class="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-violet-500/5 rounded-full blur-[120px] animate-heroPulse delay-700"></div>
    </div>

    <!-- Fixed Header (High-End Glassmorphism) -->
    <header class="sticky top-0 z-[100] bg-slate-900/80 backdrop-blur-2xl border-b border-white/[0.08] shadow-2xl shadow-slate-900/20 transition-all duration-500">
      <div class="max-w-[1500px] mx-auto px-6 md:px-10 py-5 flex justify-between items-center">
        <div class="flex flex-col">
          <h1 class="text-xl md:text-2xl font-black text-white tracking-tight">{{ $t('admin.dashboard.title') }}</h1>
          <span class="text-[10px] text-primary-400 font-bold uppercase tracking-[0.3em] -mt-0.5">{{ $t('admin.dashboard.subtitle') }}</span>
        </div>
        <button @click="logout" class="flex items-center gap-3 px-6 py-2.5 bg-white/5 border border-white/10 text-white text-sm font-bold rounded-2xl transition-all duration-300 hover:bg-red-500 hover:border-red-500 hover:shadow-lg hover:shadow-red-500/30 active:scale-95 group relative overflow-hidden">
          <span class="material-icons text-xl transition-transform group-hover:translate-x-1 relative z-10">logout</span>
          <span class="relative z-10">{{ $t('common.logout') }}</span>
        </button>
      </div>
    </header>

    <!-- Main Content Area -->
    <div class="relative z-10 max-w-[1500px] mx-auto p-6 md:p-10 space-y-10">
      <!-- Statistics High-Visibility Section -->
      <AdminStats :stats="stats" />

      <!-- Tab & Action Navigation Wrapper -->
      <div class="bg-white/60 backdrop-blur-xl rounded-[2rem] p-3 flex flex-col xl:flex-row justify-between items-center gap-6 shadow-premium ring-1 ring-white/60 relative overflow-hidden transition-all duration-500 hover:shadow-premium-hover">
        <!-- Floating Active Tab Decoration -->
        <div class="flex flex-wrap md:flex-nowrap justify-center gap-2 p-1.5 bg-slate-100/50 rounded-2.5xl border border-white/50 w-full xl:w-auto shadow-inner">
          <button 
            @click="activeTab = 'pending'" 
            class="flex items-center gap-3 px-8 py-3.5 rounded-2xl text-[13px] font-black transition-all duration-500 relative overflow-hidden group/tab"
            :class="activeTab === 'pending' ? 'bg-white text-primary-600 shadow-lg shadow-slate-200/50 ring-1 ring-black/5 scale-[1.02]' : 'text-slate-500 hover:text-slate-800 hover:bg-white/50'"
          >
            <span class="material-icons transition-transform duration-500" :class="activeTab === 'pending' ? 'scale-110' : 'group-hover/tab:scale-110'">hourglass_empty</span>
            <span class="uppercase tracking-widest leading-none">{{ $t('admin.tabs.pending') }}</span>
            <span class="inline-flex items-center justify-center min-w-[24px] h-6 px-2 rounded-lg text-[11px] font-black transition-colors" :class="activeTab === 'pending' ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30' : 'bg-slate-200 text-slate-500'">{{ pendingUsers.length }}</span>
          </button>
          
          <button 
            @click="activeTab = 'users'" 
            class="flex items-center gap-3 px-8 py-3.5 rounded-2xl text-[13px] font-black transition-all duration-500 relative overflow-hidden group/tab"
            :class="activeTab === 'users' ? 'bg-white text-primary-600 shadow-lg shadow-slate-200/50 ring-1 ring-black/5 scale-[1.02]' : 'text-slate-500 hover:text-slate-800 hover:bg-white/50'"
          >
            <span class="material-icons transition-transform duration-500" :class="activeTab === 'users' ? 'scale-110' : 'group-hover/tab:scale-110'">group</span>
            <span class="uppercase tracking-widest leading-none">{{ $t('admin.tabs.allUsers') }}</span>
            <span class="inline-flex items-center justify-center min-w-[24px] h-6 px-2 rounded-lg text-[11px] font-black transition-colors" :class="activeTab === 'users' ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30' : 'bg-slate-200 text-slate-500'">{{ allUsers.length }}</span>
          </button>
        </div>

        <button @click="refreshData" class="w-14 h-14 flex items-center justify-center bg-white text-slate-400 rounded-2.5xl transition-all duration-500 shadow-sm border border-slate-100 hover:text-primary-500 hover:border-primary-200 hover:shadow-xl hover:shadow-primary-500/10 hover:-translate-y-1 active:scale-95 group/refresh relative overflow-hidden" title="Refresh Dashboard">
          <span class="absolute inset-0 bg-primary-50 opacity-0 group-hover/refresh:opacity-100 transition-opacity"></span>
          <span class="material-icons text-2xl transition-transform duration-700 group-hover/refresh:rotate-180 relative z-10">refresh</span>
        </button>
      </div>

      <!-- Main Toolbar & Filters Container -->
      <transition enter-active-class="duration-500 ease-out" enter-from-class="opacity-0 -translate-y-4" enter-to-class="opacity-100 translate-y-0">
        <AdminToolbar
          :filters="filters"
          @update:filters="filters = $event"
          v-model:searchQuery="searchQuery"
          :availableOrganizations="availableOrganizations"
          :showBulkApprove="activeTab === 'pending' && filteredPendingUsers.length > 0"
          :selectedCount="selectedCount"
          @clear-search="clearSearch"
          @filter-today="filterToday"
          @bulk-approve="bulkApprove"
        />
      </transition>

      <!-- Active Module Container -->
      <div class="pb-20">
        <transition mode="out-in" enter-active-class="duration-500 cubic-bezier(0.34, 1.56, 0.64, 1)" enter-from-class="opacity-0 translate-y-8 scale-[0.98]" enter-to-class="opacity-100 translate-y-0 scale-100" leave-active-class="duration-300 ease-in" leave-from-class="opacity-100 translate-y-0 scale-100" leave-to-class="opacity-0 -translate-y-8 scale-[0.98]">
          <div :key="activeTab">
            <!-- User Management Table -->
            <UserTable
              :users="activeTab === 'pending' ? filteredPendingUsers : filteredAllUsers"
              :mode="activeTab"
              :selectedUsers="selectedUsers"
              @update:selectedUsers="selectedUsers = $event"
              :currentUser="currentUser"
              :loading="loading"
              @approve="approveUser"
              @reject="rejectUser"
              @delete="deleteUser"
              @change-role="changeUserRole"
            />
          </div>
        </transition>
      </div>
    </div>

    <!-- Notification Engine (Glassmorphism Toast) -->
    <transition 
      enter-active-class="transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1)"
      leave-active-class="transition-all duration-300 ease-in"
      enter-from-class="opacity-0 translate-y-20 scale-90 blur-sm"
      leave-to-class="opacity-0 translate-y-20 scale-90 blur-sm"
    >
      <div v-if="message" class="fixed bottom-10 left-1/2 -translate-x-1/2 z-[1000] min-w-[420px] bg-slate-900/80 backdrop-blur-2xl rounded-[2rem] p-5 flex items-center gap-5 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] group/toast cursor-pointer hover:scale-105 transition-transform" @click="clearMessage">
        <div class="w-14 h-14 flex items-center justify-center rounded-2xl shadow-lg ring-1 ring-white/10 relative overflow-hidden" :class="{
          'bg-gradient-to-br from-emerald-500 to-emerald-600': messageType === 'success',
          'bg-gradient-to-br from-red-500 to-red-600': messageType === 'error',
          'bg-gradient-to-br from-blue-500 to-blue-600': messageType === 'info'
        }">
          <span class="material-icons text-2xl text-white animate-bounce relative z-10">
            {{ messageType === 'success' ? 'verified' : messageType === 'error' ? 'error_outline' : 'info' }}
          </span>
          <div class="absolute inset-0 bg-white/20 opacity-0 group-hover/toast:opacity-30 transition-opacity"></div>
        </div>
        <div class="flex flex-col flex-1 gap-1">
          <span class="text-[10px] font-black uppercase tracking-[0.2em] opacity-50 text-white">{{ messageType === 'success' ? $t('admin.messages.systemNotice') : $t('admin.messages.systemWarning') }}</span>
          <span class="text-[15px] font-bold text-white tracking-tight leading-snug">{{ message }}</span>
        </div>
        <button class="w-10 h-10 flex items-center justify-center bg-white/5 text-white/40 rounded-full hover:bg-white/20 hover:text-white transition-all">
          <span class="material-icons text-[20px]">close</span>
        </button>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, Ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { adminApi } from '../../services/authApi';
import type { User } from '@/types/auth'; // Ensure this path is correct

// @ts-ignore
import { loadSiteConfig } from '../../config/siteConfig';
import { useAuthStore } from '../../stores/authStore';
import { getAffiliationTypeLabel } from './utils';
import { USER_ROLES } from '../../constants';

import AdminStats from './AdminStats.vue';
import AdminToolbar from './AdminToolbar.vue';
import UserTable from './UserTable.vue';
import { showConfirmToast } from '../DataInputVirtualScroll/logic/toast';

// ...

// State
interface AdminUser extends User {
}

const { t } = useI18n();
const authStore = useAuthStore();
const activeTab = ref('pending');
const pendingUsers: Ref<AdminUser[]> = ref([]);
const allUsers: Ref<AdminUser[]> = ref([]);
const loading = ref(false);
const message = ref('');
const messageType = ref<'info' | 'success' | 'error'>('info');
const selectedUsers: Ref<string[]> = ref([]);
const searchQuery = ref('');
const filters = ref({
  affiliationType: '',
  affiliation: '',
  province: '',
  district: '',
  todayOnly: false
});

// Computed
const currentUser = computed(() => authStore.currentUser as User | null);

const stats = computed(() => ({
  total: allUsers.value.length,
  pending: pendingUsers.value.length,
  approved: allUsers.value.filter(user => user.approved).length,
  admin: allUsers.value.filter(user => user.role === USER_ROLES.ADMIN).length
}));

const selectedCount = computed(() => selectedUsers.value.length);

const filteredPendingUsers = computed(() => filterUsers(pendingUsers.value));
const filteredAllUsers = computed(() => filterUsers(allUsers.value));

const availableOrganizations = computed(() => {
  const orgSet = new Set<string>();
  const users = [...pendingUsers.value, ...allUsers.value];
  users.forEach(user => {
    if (
      (!filters.value.affiliationType || user.affiliationType === filters.value.affiliationType) &&
      user.affiliation
    ) {
      orgSet.add(user.affiliation);
    }
  });
  return Array.from(orgSet).sort();
});

// Watchers
watch(activeTab, () => {
  loadData();
  selectedUsers.value = [];
});

// Lifecycle
onMounted(() => {
  loadAllUsers();
  loadData();
});

// Methods
function filterUsers(users: any[]) {
  let filtered = users;
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase().trim();
    filtered = filtered.filter(user => {
      return (
        (user.name && user.name.toLowerCase().includes(query)) ||
        (user.email && user.email.toLowerCase().includes(query)) ||
        (user.phone && user.phone.includes(query)) ||
        (user.affiliation && user.affiliation.toLowerCase().includes(query)) ||
        (user.affiliationType && getAffiliationTypeLabel(user.affiliationType).includes(query))
      );
    });
  }
  
  if (filters.value.affiliationType) {
    filtered = filtered.filter(user => 
      user.affiliationType === filters.value.affiliationType
    );
  }

  if (filters.value.affiliation) {
    filtered = filtered.filter(user => user.affiliation === filters.value.affiliation);
  }
  
  if (filters.value.todayOnly) {
    const today = new Date().toDateString();
    filtered = filtered.filter(user => {
      const userDate = new Date(user.createdAt).toDateString();
      return userDate === today;
    });
  }
  
  return filtered;
}

async function loadData() {
  loading.value = true;
  try {
    if (activeTab.value === 'pending') {
      await loadPendingUsers();
    } else {
      await loadAllUsers();
    }
  } catch (error: unknown) {
    showMessage((error as Error).message, 'error');
  } finally {
    loading.value = false;
  }
}

async function loadPendingUsers() {
  const result = await adminApi.getPendingUsers() as any;
  if (result.data?.users) {
    pendingUsers.value = result.data.users;
  } else if (result.users) {
    pendingUsers.value = result.users;
  } else if (result.data) {
    pendingUsers.value = Array.isArray(result.data) ? result.data : [result.data];
  } else {
    pendingUsers.value = [];
  }
}

async function loadAllUsers() {
  const result = await adminApi.getAllUsers() as any;
  if (result.data?.users) {
    allUsers.value = result.data.users;
  } else if (result.users) {
    allUsers.value = result.users;
  } else if (result.data) {
    allUsers.value = Array.isArray(result.data) ? result.data : [result.data];
  } else {
    allUsers.value = [];
  }
}

async function refreshData() {
  if (activeTab.value === 'pending') {
    await loadPendingUsers();
    showMessage(t('admin.messages.pendingRefreshed'), 'success');
  } else {
    await loadAllUsers();
    showMessage(t('admin.messages.allRefreshed'), 'success');
  }
}

function filterToday() {
  filters.value.todayOnly = !filters.value.todayOnly;
  if (filters.value.todayOnly) {
    showMessage(t('admin.messages.todayOnly'), 'info');
  } else {
    showMessage(t('admin.messages.showAll'), 'info');
  }
}

function clearSearch() {
  searchQuery.value = '';
}

async function approveUser(userId: string) {
  try {
    await adminApi.approveUser(userId);
    showMessage(t('admin.messages.approved'), 'success');
    await loadPendingUsers();
    await loadAllUsers();
  } catch (error: unknown) {
    showMessage((error as Error).message, 'error');
  }
}

async function rejectUser(userId: string) {
  if (!await showConfirmToast(t('admin.messages.confirmReject'))) {
    return;
  }
  try {
    await adminApi.rejectUser(userId);
    showMessage(t('admin.messages.rejected'), 'success');
    await loadPendingUsers();
    await loadAllUsers();
  } catch (error: unknown) {
    showMessage((error as Error).message, 'error');
  }
}

async function deleteUser(userId: string) {
  if (!await showConfirmToast(t('admin.messages.confirmDelete'))) {
    return;
  }
  try {
    await adminApi.deleteUser(userId);
    showMessage(t('admin.messages.deleted'), 'success');
    await loadAllUsers();
  } catch (error: unknown) {
    showMessage((error as Error).message, 'error');
  }
}

async function changeUserRole(user: { id: string; role: string }) {
  try {
    await adminApi.updateUserRole(user.id, user.role);
    showMessage(t('admin.messages.roleChanged'), 'success');
  } catch (error: unknown) {
    showMessage((error as Error).message, 'error');
    await loadAllUsers();
  }
}

async function bulkApprove() {
  if (selectedCount.value === 0) return;
  if (!await showConfirmToast(t('admin.messages.confirmBulkApprove', { count: selectedCount.value }))) return;

  try {
    await adminApi.bulkApproveUsers(selectedUsers.value);
    showMessage(t('admin.messages.bulkApproved', { count: selectedCount.value }), 'success');
    await loadPendingUsers();
    await loadAllUsers();
    selectedUsers.value = [];
  } catch (error: unknown) {
    showMessage((error as Error).message, 'error');
  }
}

const emit = defineEmits(['logout', 'request-logout']);

function logout() {
  emit('request-logout');
}

function showMessage(msg: string, type: 'info' | 'success' | 'error' = 'info') {
  message.value = msg;
  messageType.value = type;
  setTimeout(() => {
    message.value = '';
  }, 3000);
}

function clearMessage() {
  message.value = '';
}
</script>

<style scoped>
/* All styles handled via Tailwind */
</style>
