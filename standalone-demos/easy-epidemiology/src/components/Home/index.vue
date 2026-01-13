<template>
  <div class="w-full min-h-screen bg-white">
    <HeroSection 
      :title="$t('home.hero.title')"
      :subtitle="$t('home.hero.subtitle')"
      :description="$t('home.hero.description')"
    />
    
    <FeaturesSection :features="[
      { icon: '📊', title: $t('home.features.f1.title'), description: $t('home.features.f1.desc') },
      { icon: '👥', title: $t('home.features.f2.title'), description: $t('home.features.f2.desc') },
      { icon: '🩺', title: $t('home.features.f3.title'), description: $t('home.features.f3.desc') },
      { icon: '📈', title: $t('home.features.f4.title'), description: $t('home.features.f4.desc') },
      { icon: '🔬', title: $t('home.features.f5.title'), description: $t('home.features.f5.desc') },
      { icon: '📋', title: $t('home.features.f6.title'), description: $t('home.features.f6.desc') }
    ]" />
    
    <SystemInfoSection 
      :basic-config="{
        title: $t('home.hero.title'),
        subtitle: $t('home.hero.subtitle'),
        description: $t('home.hero.description'),
        version: config.basic.version,
        lastUpdate: $t('home.system.status.lastUpdateDate'),
        platform: $t('home.system.status.platformValue')
      }"
      :current-date="currentDate"
      :system-features="$tm('home.system.features')"
      :target-users="[
        { name: $t('home.target.users.gov'), type: 'gov' },
        { name: $t('home.target.users.local'), type: 'local' },
        { name: $t('home.target.users.expert'), type: 'expert' },
        { name: $t('home.target.users.research'), type: 'research' }
      ]"
    />
    
    <QuickGuideSection :steps="quickGuideSteps" />
    
    <ContactSection />

    <!-- Floating Start Button (Only for Guest) -->
    <Transition
      enter-active-class="transition duration-500 ease-out"
      enter-from-class="translate-y-20 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition duration-300 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-20 opacity-0"
    >
      <div v-if="!authStore.isAuthenticated && !hasToken" class="fixed bottom-8 left-0 right-0 flex justify-center z-50 pointer-events-none px-6">
        <router-link 
          to="/login" 
          class="pointer-events-auto flex items-center gap-3 px-8 py-4 bg-slate-900/90 hover:bg-slate-800 text-white rounded-full shadow-2xl backdrop-blur-md transition-all duration-300 hover:scale-105 hover:-translate-y-1 hover:shadow-slate-900/30 group border border-slate-700/50"
        >
          <span class="font-bold text-lg tracking-tight">{{ $t('home.hero.startBtn') }}</span>
          <span class="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center group-hover:bg-blue-500 transition-colors">
            <span class="material-icons text-sm group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
          </span>
        </router-link>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';

// @ts-ignore
import { loadSiteConfig } from '@/config/siteConfig';
import { useAuthStore } from '@/stores/authStore';

import HeroSection from './HeroSection.vue';
import FeaturesSection from './FeaturesSection.vue';
import SystemInfoSection from './SystemInfoSection.vue';
import QuickGuideSection from './QuickGuideSection.vue';
import ContactSection from './ContactSection.vue';

const { t } = useI18n();
const config = ref(loadSiteConfig());
const hasToken = computed(() => !!localStorage.getItem('authToken'));
const authStore = useAuthStore();
const currentDate = ref('');

onMounted(() => {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const day = today.getDate().toString().padStart(2, '0');
  currentDate.value = `${year}/${month}/${day}`;
});

const quickGuideSteps = computed(() => [
  { step: 1, title: t('home.quickGuide.steps.s1.title'), description: t('home.quickGuide.steps.s1.desc') },
  { step: 2, title: t('home.quickGuide.steps.s2.title'), description: t('home.quickGuide.steps.s2.desc') },
  { step: 3, title: t('home.quickGuide.steps.s3.title'), description: t('home.quickGuide.steps.s3.desc') },
  { step: 4, title: t('home.quickGuide.steps.s4.title'), description: t('home.quickGuide.steps.s4.desc') },
  { step: 5, title: t('home.quickGuide.steps.s5.title'), description: t('home.quickGuide.steps.s5.desc') }
]);
</script>

<style scoped>
/* Scoped styles replaced by Tailwind utilities */
</style>
