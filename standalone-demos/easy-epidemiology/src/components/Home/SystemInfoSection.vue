<template>
  <section class="py-20 bg-slate-50 border-t border-slate-200">
    <div class="max-w-[1200px] mx-auto px-6">
      
      <!-- Dashboard Stats Bar (Light Theme & Grid Layout) -->
      <div class="stats-bar">
        
        <!-- #1 System Status -->
        <div class="stat-group relative z-10">
          <div class="stat-icon-box bg-emerald-50 text-emerald-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
          </div>
            <div class="flex flex-col">
            <span class="stat-label">{{ $t('home.system.status.label') }}</span>
            <div class="flex items-center gap-2">
              <span class="relative flex h-2.5 w-2.5">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span class="stat-value text-emerald-700">{{ $t('home.system.status.operational') }}</span>
            </div>
          </div>
        </div>

        <!-- #2 Version -->
        <div class="stat-group relative z-10">
          <div class="stat-icon-box bg-blue-50 text-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
          </div>
          <div class="flex flex-col">
            <span class="stat-label">{{ $t('home.system.status.version') }}</span>
            <span class="stat-value text-slate-900">{{ basicConfig.version }}</span>
          </div>
        </div>

        <!-- #3 Last Update -->
        <div class="stat-group relative z-10">
          <div class="stat-icon-box bg-indigo-50 text-indigo-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
          </div>
          <div class="flex flex-col">
            <span class="stat-label">{{ $t('home.system.status.lastUpdate') }}</span>
            <span class="stat-value text-slate-900">{{ basicConfig.lastUpdate }}</span>
          </div>
        </div>

        <!-- #4 Platform -->
        <div class="stat-group relative z-10">
          <div class="stat-icon-box bg-violet-50 text-violet-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
          </div>
          <div class="flex flex-col">
            <span class="stat-label">{{ $t('home.system.status.platform') }}</span>
            <span class="stat-value text-slate-900">{{ basicConfig.platform }}</span>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-[1fr,1.5fr] gap-8">
      <!-- Left: Organization & Contact -->
        <div class="flex flex-col h-full">
          <div class="info-card">
            <div class="info-card-header">
              <h3 class="info-card-title keep-all">{{ $t('home.system.org') }}</h3>
              <div class="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[0.85rem] font-bold shadow-sm">{{ $t('home.system.deptName') }}</div>
            </div>
            <div class="p-8">
              <div class="mb-8">
                <p class="text-[1.35rem] font-black text-slate-900 mb-2 keep-all tracking-tight">{{ $t('home.system.centerName') }}</p>
                <p class="text-slate-500 font-medium">{{ $t('home.system.subCenterName') }}</p>
              </div>
              
              <div class="flex flex-col gap-3">
                <div 
                  class="flex justify-between items-center p-4 bg-slate-50/50 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-sm transition-all duration-300"
                >
                  <span class="text-slate-500 text-sm font-bold bg-white px-2 py-1 rounded-md shadow-sm border border-slate-100">{{ $t('home.system.members.role1') }}</span>
                  <span class="text-slate-900 font-bold tracking-tight">{{ $t('home.system.members.name1') }}</span>
                </div>
                 <div 
                  class="flex justify-between items-center p-4 bg-slate-50/50 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-sm transition-all duration-300"
                >
                  <span class="text-slate-500 text-sm font-bold bg-white px-2 py-1 rounded-md shadow-sm border border-slate-100">{{ $t('home.system.members.role2') }}</span>
                  <span class="text-slate-900 font-bold tracking-tight">{{ $t('home.system.members.name2') }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Education & Features -->
        <div class="flex flex-col h-full">
          <div class="info-card">
            <div class="info-card-header">
              <h3 class="info-card-title">{{ $t('home.system.edu') }}</h3>
            </div>
            <div class="p-8">
              <ul class="space-y-6 mb-8">
                <li class="flex gap-5 group">
                  <div class="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-110 duration-300 border border-blue-100">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>
                  </div>
                  <div class="flex flex-col justify-center">
                    <span class="text-[1.05rem] font-bold text-slate-800 mb-0.5 keep-all tracking-tight group-hover:text-blue-700 transition-colors">{{ $t('home.system.education.items.edu1.title') }}</span>
                    <span class="text-sm text-slate-500 font-medium">{{ $t('home.system.education.items.edu1.subtitle') }}</span>
                  </div>
                </li>
                <li class="flex gap-5 group">
                  <div class="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-110 duration-300 border border-blue-100">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>
                  </div>
                  <div class="flex flex-col justify-center">
                    <span class="text-[1.05rem] font-bold text-slate-800 mb-0.5 keep-all tracking-tight group-hover:text-blue-700 transition-colors">{{ $t('home.system.education.items.edu2.title') }}</span>
                    <span class="text-sm text-slate-500 font-medium">{{ $t('home.system.education.items.edu2.subtitle') }}</span>
                  </div>
                </li>
              </ul>
              
              <div class="flex flex-wrap gap-2.5">
                <span v-for="feature in systemFeatures" :key="feature" class="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-600 font-semibold hover:bg-white hover:border-blue-200 hover:text-blue-600 hover:shadow-sm transition-all cursor-default">
                  {{ feature }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
withDefaults(defineProps<{
  basicConfig: any;
  currentDate: string;
  systemFeatures?: any[];
  targetUsers?: any[];
}>(), {
  systemFeatures: () => [],
  targetUsers: () => []
});
</script>

<style scoped>
/* Scoped CSS removed as all styles are now handled by Tailwind utility classes */
.stats-bar {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 bg-white 
         rounded-[2.5xl] p-8 lg:p-10 shadow-xl shadow-slate-200/50 mb-20 relative overflow-hidden
         border border-slate-100;
}

.stat-group {
  @apply flex items-center gap-5 p-2 rounded-xl transition-all duration-300;
}

.stat-icon-box {
  @apply w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 
         shadow-inner-soft transition-transform duration-300 group-hover:scale-110;
}

.stat-label {
  @apply text-[11px] uppercase tracking-widest text-slate-400 font-bold mb-1;
}

.stat-value {
  @apply text-[1.1rem] font-black tracking-tight leading-none;
}

.info-card {
  @apply bg-white border border-slate-200 rounded-[2.5xl] 
         overflow-hidden h-full shadow-sm hover:shadow-xl hover:-translate-y-1 
         transition-all duration-500 hover:border-blue-200/50 relative z-10;
}

.info-card-header {
  @apply p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50;
}

.info-card-title {
  @apply text-[1.2rem] font-bold text-slate-900 tracking-tight;
}
</style>

