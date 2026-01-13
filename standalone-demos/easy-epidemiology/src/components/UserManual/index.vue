<template>
  <div class="h-full flex bg-slate-50 font-['Pretendard',_sans-serif] overflow-hidden" :class="isLoggedIn ? 'pb-0' : 'pb-0'">
    <!-- Sidebar -->
    <ManualSidebar 
      :active-section="activeSection"
      :is-logged-in="isLoggedIn"
      @navigate="scrollToSection"
    />

    <!-- Main Content -->
    <main class="flex-1 overflow-y-auto scroll-smooth relative" ref="mainContent" @scroll="onScroll">
      <div class="max-w-5xl mx-auto p-8 lg:p-12" :class="isLoggedIn ? 'pb-32' : 'pb-20'">
        <!-- Header -->
        <div class="mb-12">
          <h1 class="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">{{ $t('manual.title') }}</h1>
          <p class="text-lg text-slate-500">{{ $t('manual.subtitle') }}</p>
        </div>

        <!-- Sections -->
        <component 
          v-for="section in sections" 
          :key="section.id"
          :is="section.component"
          :id="section.id"
          class="scroll-mt-8 mb-16"
        />

        <!-- Footer -->
        <div class="border-t border-slate-200 pt-12 mt-20 text-center text-slate-400 text-sm">
          {{ $t('manual.footer') }}
        </div>
      </div>

      <!-- Quick Top Button -->
      <button 
        @click="scrollToTop"
        class="fixed right-8 w-12 h-12 bg-white border border-slate-200 shadow-lg rounded-full flex items-center justify-center text-slate-600 hover:text-blue-600 hover:border-blue-200 transition-all z-20"
        :class="[
          !showTopBtn ? 'translate-y-20 opacity-0' : 'translate-y-0 opacity-100',
          isLoggedIn ? 'bottom-[72px]' : 'bottom-8'
        ]"
      >
        <span class="material-icons-round">arrow_upward</span>
      </button>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, defineAsyncComponent, computed } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import ManualSidebar from './ManualSidebar.vue';

const authStore = useAuthStore();
const isLoggedIn = computed(() => authStore.isAuthenticated);

// Async Components for Sections
const SectionIntro = defineAsyncComponent(() => import('./sections/SectionIntro.vue'));
const SectionDataInput = defineAsyncComponent(() => import('./sections/SectionDataInput.vue'));
const SectionPatient = defineAsyncComponent(() => import('./sections/SectionPatient.vue'));
const SectionSymptoms = defineAsyncComponent(() => import('./sections/SectionSymptoms.vue'));
const SectionEpidemic = defineAsyncComponent(() => import('./sections/SectionEpidemic.vue'));
const SectionCaseControl = defineAsyncComponent(() => import('./sections/SectionCaseControl.vue'));
const SectionCohort = defineAsyncComponent(() => import('./sections/SectionCohort.vue'));
const SectionReport = defineAsyncComponent(() => import('./sections/SectionReport.vue'));
const SectionCaseSeries = defineAsyncComponent(() => import('./sections/SectionCaseSeries.vue'));
const SectionTeam = defineAsyncComponent(() => import('./sections/SectionTeam.vue'));

const sections = [
  { id: 'intro', component: SectionIntro },
  { id: 'data-input', component: SectionDataInput },
  { id: 'patient-characteristics', component: SectionPatient },
  { id: 'clinical-symptoms', component: SectionSymptoms },
  { id: 'epidemic-curve', component: SectionEpidemic },
  { id: 'case-control', component: SectionCaseControl },
  { id: 'cohort-study', component: SectionCohort },
  { id: 'report-writer', component: SectionReport },
  { id: 'case-series', component: SectionCaseSeries },
  { id: 'team', component: SectionTeam },
];

const mainContent = ref<HTMLElement | null>(null);
const activeSection = ref('intro');
const showTopBtn = ref(false);
let isManualScroll = false;

function scrollToSection(id: string) {
  isManualScroll = true;
  activeSection.value = id;
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => { isManualScroll = false; }, 1000);
  }
}

function scrollToTop() {
  if (mainContent.value) {
    mainContent.value.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function onScroll() {
  if (!mainContent.value) return;
  
  // Top button visibility
  showTopBtn.value = mainContent.value.scrollTop > 300;

  if (isManualScroll) return;

  // Active section detection
  const scrollPos = mainContent.value.scrollTop + 100;
  
  for (const section of sections) {
    const el = document.getElementById(section.id);
    if (el) {
      const top = el.offsetTop;
      const height = el.offsetHeight;
      
      if (scrollPos >= top && scrollPos < top + height) {
        activeSection.value = section.id;
        break;
      }
    }
  }
}
</script>
