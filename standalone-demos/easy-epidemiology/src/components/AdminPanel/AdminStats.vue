<template>
  <div class="mb-8">
    <div class="flex flex-wrap items-center justify-between gap-6 bg-slate-900 p-8 md:p-12 rounded-[2.5rem] shadow-premium shadow-slate-900/30 border border-white/5 relative overflow-hidden group/stats">
      <!-- Sophisticated Decorative Background -->
      <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-500/5 rounded-full blur-[100px] -mr-64 -mt-64 pointer-events-none transition-transform duration-1000 group-hover/stats:scale-110"></div>
      <div class="absolute bottom-0 left-0 w-[400px] h-[400px] bg-violet-500/5 rounded-full blur-[100px] -ml-40 -mb-40 pointer-events-none transition-transform duration-1000 group-hover/stats:scale-110 delay-150"></div>

      <!-- Total Users -->
      <StatCard
        :title="$t('admin.stats.totalUsers')"
        :count="stats.total"
        icon="people"
        color="blue"
      />

      <div class="hidden xl:block w-px h-16 bg-gradient-to-b from-transparent via-slate-700/50 to-transparent flex-shrink-0 mx-2"></div>

      <!-- Pending Users -->
      <StatCard
        :title="$t('admin.stats.pendingUsers')"
        :count="stats.pending"
        icon="pending_actions"
        color="amber"
      />

      <div class="hidden xl:block w-px h-16 bg-gradient-to-b from-transparent via-slate-700/50 to-transparent flex-shrink-0 mx-2"></div>

      <!-- Approved Users -->
      <StatCard
        :title="$t('admin.stats.approvedUsers')"
        :count="stats.approved"
        icon="verified_user"
        color="emerald"
      />

      <div class="hidden xl:block w-px h-16 bg-gradient-to-b from-transparent via-slate-700/50 to-transparent flex-shrink-0 mx-2"></div>

      <!-- Admin Users -->
      <StatCard
        :title="$t('admin.stats.adminUsers')"
        :count="stats.admin"
        icon="admin_panel_settings"
        color="primary"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import StatCard from './StatCard.vue';
// @ts-ignore
import { useI18n } from 'vue-i18n';

interface Stats {
  total: number;
  pending: number;
  approved: number;
  admin: number;
}

const props = withDefaults(defineProps<{ stats: Stats }>(), {
  stats: () => ({ total: 0, pending: 0, approved: 0, admin: 0 })
});
</script>

<style scoped>
/* All styles handled via Tailwind */
</style>
