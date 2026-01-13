<template>
  <aside class="w-72 bg-white border-r border-slate-200 flex flex-col shrink-0 z-20 h-full">
    <!-- Header -->
    <div class="p-6 border-b border-slate-100 flex items-center justify-between shrink-0">
      <router-link to="/info" class="flex items-center gap-2 text-slate-900 font-extrabold text-lg hover:opacity-80 transition-opacity">
        <span class="material-icons-round text-blue-600">health_and_safety</span>
        <span>Manual</span>
      </router-link>
      <router-link to="/info" class="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors" title="홈으로">
        <span class="material-icons-round text-xl">home</span>
      </router-link>
    </div>

    <!-- Navigation List -->
    <div class="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
      <button 
        v-for="item in navItems" 
        :key="item.id"
        @click="$emit('navigate', item.id)"
        class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200"
        :class="activeSection === item.id ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'"
      >
        <span class="material-icons-round text-lg" :class="activeSection === item.id ? 'text-blue-600' : 'text-slate-400'">{{ item.icon }}</span>
        <span class="flex-1 text-left">{{ item.label }}</span>
        <span v-if="activeSection === item.id" class="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
      </button>
    </div>

    <!-- Bottom Actions -->
    <div class="p-4 border-t border-slate-100 bg-slate-50/50 shrink-0 transform transition-all duration-300" :class="isLoggedIn ? 'pb-[64px]' : 'pb-4'">
      <router-link to="/input" class="flex items-center justify-center gap-2 w-full py-3 bg-slate-900 text-white font-bold rounded-xl shadow-lg hover:bg-slate-800 hover:scale-[1.02] active:scale-[0.98] transition-all text-sm">
        <span class="material-icons-round text-lg">play_arrow</span>
        앱 실행하기
      </router-link>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
defineProps<{
  activeSection: string;
  isLoggedIn: boolean;
}>();

defineEmits<{
  (e: 'navigate', id: string): void;
}>();

const { t } = useI18n();

const navItems = computed(() => [
  { id: 'intro', label: t('manual.menu.intro'), icon: 'dashboard' },
  { id: 'data-input', label: t('manual.menu.dataInput'), icon: 'grid_on' },
  { id: 'patient-characteristics', label: t('manual.menu.patient'), icon: 'people' },
  { id: 'clinical-symptoms', label: t('manual.menu.symptoms'), icon: 'medical_services' },
  { id: 'epidemic-curve', label: t('manual.menu.epidemic'), icon: 'show_chart' },
  { id: 'case-control', label: t('manual.menu.caseControl'), icon: 'compare_arrows' },
  { id: 'cohort-study', label: t('manual.menu.cohort'), icon: 'groups' },
  { id: 'report-writer', label: t('manual.menu.report'), icon: 'description' },
  { id: 'case-series', label: t('manual.menu.caseSeries'), icon: 'list_alt' },
  { id: 'team', label: t('manual.menu.team'), icon: 'info' },
]);
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
