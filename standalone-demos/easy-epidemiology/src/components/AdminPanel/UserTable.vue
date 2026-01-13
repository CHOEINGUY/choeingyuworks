<template>
  <div class="bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-white/60 shadow-premium shadow-slate-900/5 overflow-hidden transition-all duration-300 ring-1 ring-slate-900/5 relative">
    <!-- Loading State -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-32 px-6 text-center">
      <div class="mb-8 relative">
        <div class="absolute inset-0 bg-primary-500/20 blur-2xl rounded-full scale-150 animate-pulse"></div>
        <div class="relative w-16 h-16 border-4 border-slate-100 border-t-primary-500 rounded-full animate-spin"></div>
      </div>
      <h3 class="text-xl font-black text-slate-800 mb-2 tracking-tight">{{ $t('admin.loading.title') }}</h3>
      <p class="text-sm font-medium text-slate-400">{{ $t('admin.loading.subtitle') }}</p>
    </div>
    
    <!-- Empty State -->
    <div v-else-if="users.length === 0" class="flex flex-col items-center justify-center py-40 px-6 text-center bg-slate-50/30">
      <div class="w-32 h-32 rounded-[2.5rem] flex items-center justify-center mb-8 shadow-inner shadow-slate-900/5 bg-white relative group transition-transform duration-500 hover:scale-105 hover:rotate-3" :class="mode === USER_STATUS.PENDING ? 'text-emerald-500 ring-4 ring-emerald-50' : 'text-slate-300 ring-4 ring-slate-50'">
        <div class="absolute inset-0 bg-current transition-opacity duration-300 opacity-0 group-hover:opacity-5 rounded-inherit"></div>
        <span class="material-icons text-7xl transition-transform duration-500 group-hover:scale-110">{{ mode === USER_STATUS.PENDING ? 'verified_user' : 'person_off' }}</span>
      </div>

      <h3 class="text-2xl font-black text-slate-800 mb-3 tracking-tight">{{ mode === USER_STATUS.PENDING ? $t('admin.emptyState.title') : $t('admin.userNotFound.title') }}</h3>
      <p class="text-[15px] font-medium text-slate-500 max-w-xs mx-auto leading-relaxed">{{ mode === USER_STATUS.PENDING ? $t('admin.emptyState.description') : $t('admin.userNotFound.description') }}</p>
    </div>

    <!-- Table -->
    <div v-else class="overflow-x-auto min-h-[600px]">
      <table class="w-full border-separate border-spacing-y-1.5 px-4 pb-4">
        <thead class="sticky top-0 z-30">
          <tr>
            <th v-if="mode === USER_STATUS.PENDING" class="w-16 px-4 py-4 text-center first:rounded-l-2xl last:rounded-r-2xl bg-slate-50/90 backdrop-blur-md border-b border-slate-200/50">
              <div class="relative flex items-center justify-center group">
                <input 
                  type="checkbox" 
                  :checked="isAllSelected"
                  @change="toggleSelectAll"
                  class="peer h-5 w-5 cursor-pointer appearance-none rounded-lg border-2 border-slate-300 transition-all checked:border-primary-500 checked:bg-primary-500 hover:border-primary-400 focus:outline-none focus:ring-4 focus:ring-primary-500/10 shadow-sm"
                  id="select-all"
                />
                <span class="material-icons absolute opacity-0 peer-checked:opacity-100 pointer-events-none text-white text-[16px] font-black">check</span>
              </div>
            </th>
            <th class="px-6 py-4 text-left text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] bg-slate-50/90 backdrop-blur-md border-b border-slate-200/50 group cursor-default transition-colors hover:text-primary-500">
              <span class="flex items-center gap-2">{{ $t('admin.table.name') }} <span class="material-icons text-[14px] opacity-0 group-hover:opacity-100 transition-opacity text-primary-400">sort</span></span>
            </th>
            <th class="px-4 py-4 text-left text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] bg-slate-50/90 backdrop-blur-md border-b border-slate-200/50">{{ $t('admin.toolbar.filter.affiliationType') }}</th>
            <th class="px-6 py-4 text-left text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] bg-slate-50/90 backdrop-blur-md border-b border-slate-200/50">{{ $t('admin.toolbar.filter.affiliation') }}</th>
            <th class="px-6 py-4 text-left text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] bg-slate-50/90 backdrop-blur-md border-b border-slate-200/50">{{ $t('admin.table.email') }}</th>
            <th class="px-6 py-4 text-left text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] bg-slate-50/90 backdrop-blur-md border-b border-slate-200/50">{{ $t('common.contact') }}</th>
            <th class="px-6 py-4 text-left text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] bg-slate-50/90 backdrop-blur-md border-b border-slate-200/50">{{ $t('admin.table.status') }}</th>
            <th v-if="mode === 'users'" class="px-6 py-4 text-left text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] bg-slate-50/90 backdrop-blur-md border-b border-slate-200/50">{{ $t('admin.table.role') }}</th>
            <th class="px-6 py-4 text-left text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] bg-slate-50/90 backdrop-blur-md border-b border-slate-200/50">{{ $t('auth.register.step1.joinDate') }}</th>
            <th class="px-6 py-4 text-center text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] bg-slate-50/90 backdrop-blur-md border-b border-slate-200/50 rounded-r-2xl">{{ $t('admin.table.actions') }}</th>
          </tr>
        </thead>
        <tbody class="space-y-2">
          <tr v-for="user in typedUsers" :key="user.id" 
            class="group relative transition-all duration-300 hover:z-10 hover:scale-[1.01] hover:bg-white hover:shadow-premium rounded-2xl"
          >
            <td v-if="mode === USER_STATUS.PENDING" class="px-4 py-5 text-center first:rounded-l-2xl border-y border-l border-transparent group-hover:border-slate-100/50">
              <div class="relative flex items-center justify-center">
                <input 
                  type="checkbox" 
                  :value="user.id"
                  :checked="selectedUsers.includes(user.id)"
                  @change="onUserCheckbox(user.id, $event)"
                  class="peer h-5 w-5 cursor-pointer appearance-none rounded-lg border-2 border-slate-300 transition-all checked:border-primary-500 checked:bg-primary-500 hover:border-primary-400 focus:outline-none focus:ring-4 focus:ring-primary-500/10 shadow-sm"
                  :id="'user-' + user.id"
                />
                <span class="material-icons absolute opacity-0 peer-checked:opacity-100 pointer-events-none text-white text-[16px] font-black">check</span>
              </div>
            </td>
            <td class="px-6 py-5 whitespace-nowrap first:rounded-l-2xl border-y border-transparent group-hover:border-slate-100/50" :class="{'first:border-l': mode !== USER_STATUS.PENDING}">
              <div class="flex items-center gap-4">
                <div class="w-11 h-11 rounded-xl flex items-center justify-center text-[15px] font-black text-white shadow-md shadow-slate-200 transition-all duration-500 group-hover:scale-110 group-hover:shadow-lg relative overflow-hidden ring-2 ring-white" :class="getAvatarBgClass(user)">
                  <div class="absolute inset-0 bg-gradient-to-tr from-black/10 to-transparent"></div>
                  <div class="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-20 transition-opacity"></div>
                  <span class="relative z-10 drop-shadow-sm">{{ getInitials(user.name) }}</span>
                </div>
                <div>
                  <div v-if="user.name" class="font-bold text-slate-800 tracking-tight group-hover:text-primary-600 transition-colors text-[15px]">{{ user.name }}</div>
                  <div v-else class="text-sm italic text-slate-400">{{ $t('admin.table.noName') }}</div>
                  <div class="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5 bg-slate-100 px-1.5 py-0.5 rounded inline-block">{{ $t('admin.table.id') }}: {{ user.id.substring(0, 8) }}</div>
                </div>
              </div>
            </td>
            <td class="px-4 py-5 whitespace-nowrap border-y border-transparent group-hover:border-slate-100/50">
              <span class="inline-flex items-center px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-[0.1em] shadow-sm border transaction-transform group-hover:scale-105" :class="getAffiliationBadgeClass(user.affiliationType || user.organizationType)">
                {{ getAffiliationTypeLabel(user.affiliationType || user.organizationType) }}
              </span>
            </td>
            <td class="px-6 py-5 border-y border-transparent group-hover:border-slate-100/50">
              <div class="text-[14px] font-bold text-slate-700 truncate max-w-[150px]" :title="user.affiliation || user.organization">{{ user.affiliation || user.organization || '-' }}</div>
            </td>
            <td class="px-6 py-5 border-y border-transparent group-hover:border-slate-100/50">
              <div class="text-[14px] font-medium text-slate-500 truncate max-w-[180px]" :title="user.email">{{ user.email || '-' }}</div>
            </td>
            <td class="px-6 py-5 border-y border-transparent group-hover:border-slate-100/50">
               <div class="text-[14px] font-bold text-slate-600 whitespace-nowrap font-mono tracking-tighter">{{ user.phone || '-' }}</div>
            </td>
            <td class="px-6 py-5 whitespace-nowrap border-y border-transparent group-hover:border-slate-100/50">
              <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black transition-all border border-transparent" :class="getStatusBadgeClass(user.status || (user.approved ? 'approved' : 'pending'))">
                <span class="w-1.5 h-1.5 rounded-full shadow-sm" :class="getStatusDotClass(user.status || (user.approved ? 'approved' : 'pending'))"></span>
                {{ getStatusLabel(user.status || (user.approved ? 'approved' : 'pending')) }}
              </span>
            </td>
            <td v-if="mode === 'users'" class="px-6 py-5 whitespace-nowrap border-y border-transparent group-hover:border-slate-100/50">
              <div v-if="currentUser && currentUser.role === USER_ROLES.ADMIN && user.id !== currentUser.id" class="relative group/select">
                <select 
                  v-model="user.role" 
                  @change="emit('change-role', user)"
                  class="appearance-none bg-slate-50 border border-slate-200 text-slate-700 text-[11px] font-black rounded-lg pl-3 pr-8 py-2 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-400 transition-all cursor-pointer shadow-sm hover:border-slate-300 hover:bg-white"
                >
                  <option :value="USER_ROLES.ADMIN">{{ $t('admin.role.admin') }}</option>
                  <option :value="USER_ROLES.SUPPORT">{{ $t('admin.role.support') }}</option>
                  <option :value="USER_ROLES.USER">{{ $t('admin.role.user') }}</option>
                </select>
                <span class="material-icons absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-sm group-hover/select:text-primary-500 transition-colors">expand_more</span>
              </div>
              <span v-else class="text-[10px] font-black text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg uppercase tracking-wider inline-block border border-slate-200/50">
                {{ getUserRoleLabel(user.role) }}
              </span>
            </td>
            <td class="px-6 py-5 text-[12px] font-bold text-slate-400 whitespace-nowrap font-mono border-y border-transparent group-hover:border-slate-100/50">
              {{ formatDate(user.createdAt) }}
            </td>
            <td class="px-6 py-5 whitespace-nowrap text-center last:rounded-r-2xl border-y border-r border-transparent group-hover:border-slate-100/50">
              <div v-if="mode === USER_STATUS.PENDING" class="flex items-center justify-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                <button @click="emit('approve', user.id)" class="w-10 h-10 flex items-center justify-center bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl transition-all duration-300 hover:bg-emerald-500 hover:text-white hover:shadow-lg hover:shadow-emerald-500/20 hover:-translate-y-1 active:scale-95 shadow-sm group/btn relative overflow-hidden" title="Approve">
                  <span class="material-icons text-[20px] transition-transform group-hover/btn:rotate-12 relative z-10">check</span>
                </button>
                <button @click="emit('reject', user.id)" class="w-10 h-10 flex items-center justify-center bg-amber-50 text-amber-600 border border-amber-100 rounded-xl transition-all duration-300 hover:bg-amber-500 hover:text-white hover:shadow-lg hover:shadow-amber-500/20 hover:-translate-y-1 active:scale-95 shadow-sm group/btn relative overflow-hidden" title="Reject">
                  <span class="material-icons text-[20px] transition-transform group-hover/btn:-rotate-12 relative z-10">close</span>
                </button>
              </div>
              <div v-else-if="mode === 'users'" class="flex items-center justify-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                <button 
                  v-if="user.id !== currentUser?.id && user.role !== USER_ROLES.ADMIN"
                  @click="emit('delete', user.id)" 
                  class="w-10 h-10 flex items-center justify-center bg-slate-50 text-slate-400 border border-slate-100 rounded-xl transition-all duration-300 hover:bg-red-500 hover:text-white hover:border-red-500 hover:shadow-lg hover:shadow-red-500/20 hover:-translate-y-1 active:scale-95 shadow-sm group/btn" 
                  :title="$t('admin.actions.delete')"
                >
                  <span class="material-icons text-[20px] transition-transform group-hover/btn:rotate-12">delete_outline</span>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { 
  getAffiliationTypeLabel, 
  formatDate,
  getStatusLabel
} from './utils';
import { AFFILIATION_TYPES, USER_ROLES, USER_ROLE_LABELS, USER_STATUS } from '../../constants';
// @ts-ignore
import { useI18n } from 'vue-i18n';

// Local interface definition to bypass import resolution issues
interface User {
  id: string;
  email: string;
  name: string;
  organization?: string;
  role: string | 'admin' | 'user' | 'support' | 'pending';
  isApproved: boolean;
  approved?: boolean;
  createdAt: string;
  phone?: string;
  affiliation?: string;
  affiliationType?: string;
  status?: 'active' | 'pending' | 'suspended' | 'inactive' | 'approved' | 'rejected' | 'hidden';
  organizationType?: string;
}

// UserRole and UserStatus for props typing
type UserRole = User['role'];
type UserStatus = User['status'];



interface Props {
  users: User[];
  mode: string;
  selectedUsers?: string[];
  currentUser?: { id: string; role: UserRole } | null;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  selectedUsers: () => [],
  currentUser: null,
  loading: false
});

const { t } = useI18n();

// Emits symbol definition
const emit = defineEmits<{
  (e: 'update:selectedUsers', value: string[]): void;
  (e: 'approve', userId: string): void;
  (e: 'reject', userId: string): void;
  (e: 'delete', userId: string): void;
  (e: 'change-role', user: User): void;
}>();

// Computeds
const typedUsers = computed(() => props.users as User[]);

const isAllSelected = computed(() => {
  return typedUsers.value.length > 0 && 
         typedUsers.value.every((user: User) => props.selectedUsers.includes(user.id));
});

// Selection helpers
function toggleSelectAll(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.checked) {
    const allIds = props.users.map((user: User) => user.id);
    emit('update:selectedUsers', allIds);
  } else {
    emit('update:selectedUsers', []);
  }
}

function updateSelection(userId: string, checked: boolean) {
  let newSelection = [...props.selectedUsers];
  if (checked) {
    if (!newSelection.includes(userId)) {
      newSelection.push(userId);
    }
  } else {
    newSelection = newSelection.filter(id => id !== userId);
  }
  emit('update:selectedUsers', newSelection);
}

// Visual helpers
function getInitials(name: string | undefined | null) {
  if (!name) return '?';
  return name.charAt(0).toUpperCase();
}

function getAvatarBgClass(user: User) {
  const type = user.affiliationType || user.organizationType || AFFILIATION_TYPES.OTHER;
  switch (type) {
  case 'hospital': return 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-blue-500/20';
  case 'clinic': return 'bg-gradient-to-br from-violet-500 to-violet-600 shadow-violet-500/20';
  case 'public_health': return 'bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-emerald-500/20';
  case 'university': return 'bg-gradient-to-br from-amber-500 to-amber-600 shadow-amber-500/20';
  case 'research': return 'bg-gradient-to-br from-pink-500 to-pink-600 shadow-pink-500/20';
  case 'government': return 'bg-gradient-to-br from-cyan-500 to-cyan-600 shadow-cyan-500/20';
  default: return 'bg-gradient-to-br from-slate-500 to-slate-600 shadow-slate-500/20';
  }
}

function getAffiliationBadgeClass(type: string | undefined) {
  switch (type) {
  case 'hospital': return 'bg-blue-50 text-blue-700 border-blue-100';
  case 'clinic': return 'bg-violet-50 text-violet-700 border-violet-100';
  case 'public_health': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
  case 'university': return 'bg-amber-50 text-amber-700 border-amber-100';
  case 'research': return 'bg-pink-50 text-pink-700 border-pink-100';
  case 'government': return 'bg-cyan-50 text-cyan-700 border-cyan-100';
  default: return 'bg-slate-50 text-slate-700 border-slate-100';
  }
}

function getStatusBadgeClass(status: string) {
  switch (status) {
  case 'approved': return 'bg-emerald-50/50 text-emerald-700 group-hover:bg-emerald-50';
  case 'pending': return 'bg-amber-50/50 text-amber-700 group-hover:bg-amber-50';
  case 'rejected': return 'bg-red-50/50 text-red-700 group-hover:bg-red-50';
  case 'suspended': return 'bg-slate-50/50 text-slate-600 group-hover:bg-slate-50';
  default: return 'bg-slate-50/50 text-slate-600 group-hover:bg-slate-50';
  }
}

function getStatusDotClass(status: string) {
  switch (status) {
  case 'approved': return 'bg-emerald-500 shadow-emerald-500/50';
  case 'pending': return 'bg-amber-500 animate-pulse shadow-amber-500/50';
  case 'rejected': return 'bg-red-500 shadow-red-500/50';
  case 'suspended': return 'bg-slate-400';
  default: return 'bg-slate-400';
  }
}

function getUserRoleLabel(role: string) {
  return (USER_ROLE_LABELS as Record<string, string>)[role] || t('admin.status.pending');
}

function onUserCheckbox(userId: string, event: Event) {
  const target = event.target as HTMLInputElement;
  updateSelection(userId, target.checked);
}
</script>

<style scoped>
/* Custom Scrollbar for table body */
.overflow-x-auto::-webkit-scrollbar {
  height: 8px;
}
.overflow-x-auto::-webkit-scrollbar-track {
  background: transparent;
}
.overflow-x-auto::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 4px;
}
.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background-color: #94a3b8;
}
</style>
