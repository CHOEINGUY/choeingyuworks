<template>
  <div class="flex flex-wrap justify-between items-center gap-6 p-1">
    <!-- Filter Section (Left) -->
    <div class="flex flex-wrap items-center gap-3">
      <!-- Affiliation Type Filter -->
      <FilterDropdown
        :label="$t('admin.toolbar.filter.affiliationType')"
        :modelValue="filters.affiliationType"
        @update:modelValue="updateFilter('affiliationType', $event)"
        :options="affiliationTypeOptions"
      />

      <!-- Affiliation Filter -->
      <FilterDropdown
        v-if="availableOrganizations.length > 0"
        :label="$t('admin.toolbar.filter.affiliation')"
        :modelValue="filters.affiliation"
        @update:modelValue="updateFilter('affiliation', $event)"
        :options="availableOrganizations"
      />

      <!-- Divider -->
      <div class="h-8 w-px bg-slate-200 mx-1 hidden sm:block"></div>

      <!-- Today Filter Button -->
      <button 
        @click="$emit('filter-today')" 
        class="h-[42px] px-5 flex items-center justify-center gap-2 rounded-xl text-sm font-bold transition-all duration-300 border relative overflow-hidden group" 
        :class="filters.todayOnly 
          ? 'bg-gradient-to-br from-blue-500 to-blue-600 border-transparent text-white shadow-lg shadow-blue-500/30' 
          : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700 hover:border-slate-300'"
        :title="$t('admin.toolbar.filter.todayTooltip')"
      >
        <span class="material-icons text-lg relative z-10 transition-transform group-hover:scale-110">today</span>
        <span class="relative z-10">{{ $t('admin.toolbar.filter.today') }}</span>
        <div v-if="!filters.todayOnly" class="absolute inset-0 bg-slate-100 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </button>
    </div>

    <!-- Search Section (Center/Right) -->
    <div class="ml-auto max-w-full md:max-w-md w-full order-first lg:order-none">
      <div class="relative flex items-center group">
        <span class="material-icons absolute left-4 text-slate-400 pointer-events-none transition-colors group-focus-within:text-blue-500">search</span>
        <input 
          :value="searchQuery" 
          type="text" 
          :placeholder="$t('admin.toolbar.search.placeholder')" 
          class="w-full bg-white border border-slate-200 rounded-2xl px-12 py-3.5 text-sm font-medium text-slate-900 placeholder-slate-400 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 shadow-sm group-hover:border-slate-300"
          @input="onSearchInput"
        />
        <button 
          v-if="searchQuery" 
          @click="$emit('clear-search')" 
          class="absolute right-3 w-8 h-8 flex items-center justify-center bg-slate-100 text-slate-400 rounded-xl transition-all hover:bg-slate-200 hover:text-slate-600 hover:scale-105 active:scale-95"
          :title="$t('admin.toolbar.search.clear')"
        >
          <span class="material-icons text-sm">close</span>
        </button>
      </div>
    </div>

    <!-- Bulk Action (Right) -->
    <div class="flex items-center">
      <transition 
        enter-active-class="transition-all duration-300 cubic-bezier(0.34, 1.56, 0.64, 1)"
        leave-active-class="transition-all duration-200 ease-in"
        enter-from-class="opacity-0 scale-90 translate-x-4"
        leave-to-class="opacity-0 scale-90 translate-x-4"
      >
        <button
          v-if="showBulkApprove"
          class="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 shadow-xl shadow-emerald-500/20 enabled:bg-gradient-to-br enabled:from-emerald-500 enabled:to-emerald-600 enabled:text-white enabled:hover:-translate-y-1 enabled:hover:shadow-emerald-500/40 enabled:active:scale-95 disabled:bg-slate-100 disabled:text-slate-300 disabled:shadow-none disabled:cursor-not-allowed border border-transparent disabled:border-slate-200 group"
          @click="$emit('bulk-approve')"
          :disabled="selectedCount === 0"
          :title="selectedCount > 0 ? $t('admin.toolbar.bulkApprove.tooltip', { count: selectedCount }) : $t('admin.toolbar.bulkApprove.tooltipEmpty')"
        >
          <span class="material-icons text-xl group-hover:rotate-12 transition-transform">done_all</span>
          <span>{{ $t('admin.toolbar.bulkApprove.label') }}</span>
          <span v-if="selectedCount > 0" class="inline-flex items-center justify-center min-w-[24px] h-6 px-1.5 rounded-lg bg-white/20 text-xs font-black backdrop-blur-sm">{{ selectedCount }}</span>
        </button>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import FilterDropdown from './FilterDropdown.vue';

const { t } = useI18n();

interface Filters {
  affiliationType: string;
  affiliation: string;
  todayOnly: boolean;
  [key: string]: string | boolean;
}

interface Props {
  filters: Filters;
  searchQuery?: string;
  availableOrganizations?: string[];
  showBulkApprove?: boolean;
  selectedCount?: number;
}

const props = withDefaults(defineProps<Props>(), {
  searchQuery: '',
  availableOrganizations: () => [],
  showBulkApprove: false,
  selectedCount: 0
});

const emit = defineEmits([
  'update:filters', 
  'update:searchQuery', 
  'filter-today', 
  'clear-search', 
  'bulk-approve'
]);

const affiliationTypeOptions = computed(() => [
  { value: 'hospital', label: t('admin.toolbar.affiliationTypes.hospital') },
  { value: 'clinic', label: t('admin.toolbar.affiliationTypes.clinic') },
  { value: 'public_health', label: t('admin.toolbar.affiliationTypes.public_health') },
  { value: 'university', label: t('admin.toolbar.affiliationTypes.university') },
  { value: 'research', label: t('admin.toolbar.affiliationTypes.research') },
  { value: 'government', label: t('admin.toolbar.affiliationTypes.government') },
  { value: 'other', label: t('admin.toolbar.affiliationTypes.other') }
]);

function updateFilter(key: string, value: string) {
  const newFilters = { ...props.filters, [key]: value };
  emit('update:filters', newFilters);
}

function onSearchInput(event: Event) {
  const target = event.target as HTMLInputElement;
  emit('update:searchQuery', target.value);
}
</script>

<style scoped>
/* All styles handled via Tailwind */
</style>
