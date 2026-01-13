<template>
  <section class="py-32 bg-slate-50">
    <div class="max-w-container mx-auto px-6">
      <div class="text-center max-w-[600px] mx-auto mb-20">
        <h2 class="text-[2.5rem] font-extrabold text-slate-900 mb-4 tracking-tight keep-all">{{ $t('home.features.mainTitle') }}</h2>
        <p class="text-body-lg text-slate-500 leading-relaxed keep-all">{{ $t('home.features.subTitle') }}</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-[280px] gap-6">
        <!-- #0: Data Input (Large Card) -->
        <!-- #0: Data Input (Large Card) -->
        <div class="feature-card group lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3 !bg-gradient-to-br !from-white !to-slate-50">
          <div class="flex flex-col flex-1">
            <div class="w-12 h-12 bg-slate-200 text-slate-900 rounded-xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-slate-900 group-hover:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
            </div>
            <h3 class="text-xl font-bold text-slate-900 mb-3 tracking-tight">{{ features[0].title }}</h3>
            <p class="text-[0.95rem] text-slate-500 leading-relaxed">{{ features[0].description }}</p>
          </div>
          <div class="mt-auto pt-8 flex justify-center">
            <div class="w-full bg-white/80 backdrop-blur border border-slate-200 rounded-2xl p-4 shadow-sm relative overflow-hidden group-hover:border-blue-200 transition-colors duration-500">
              <!-- Scanning Line Effect (Only on Hover) -->
              <div class="absolute top-0 left-0 w-full h-[2px] bg-blue-500/50 shadow-[0_0_10px_rgba(59,130,246,0.5)] group-hover:animate-scan-line opacity-0 group-hover:opacity-100"></div>

              <!-- Input Row 1 -->
              <div class="flex items-center gap-3 mb-3">
                <div class="w-2 h-2 rounded-full bg-slate-200 group-hover:bg-emerald-500 transition-colors duration-300 delay-500"></div>
                <!-- Input Field: Dot Typing -->
                <div class="h-6 bg-slate-100 rounded-md w-[70%] flex items-center px-3 gap-1 overflow-hidden">
                  <div class="w-1.5 h-1.5 bg-slate-400 rounded-full opacity-0 group-hover:animate-type-dot" style="animation-delay: 600ms"></div>
                  <div class="w-1.5 h-1.5 bg-slate-400 rounded-full opacity-0 group-hover:animate-type-dot" style="animation-delay: 700ms"></div>
                  <div class="w-1.5 h-1.5 bg-slate-400 rounded-full opacity-0 group-hover:animate-type-dot" style="animation-delay: 800ms"></div>
                  <div class="w-1.5 h-1.5 bg-slate-400 rounded-full opacity-0 group-hover:animate-type-dot" style="animation-delay: 900ms"></div>
                  <div class="w-1.5 h-1.5 bg-slate-400 rounded-full opacity-0 group-hover:animate-type-dot" style="animation-delay: 1000ms"></div>
                  <!-- Cursor -->
                  <div class="w-0.5 h-4 bg-blue-500 animate-pulse hidden group-hover:block ml-0.5"></div>
                </div>
                <!-- Check Icon (Only on Hover) -->
                <div class="ml-auto opacity-0 group-hover:opacity-100 transition-all duration-300 delay-[1200ms] transform translate-y-1 group-hover:translate-y-0">
                  <svg class="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
                </div>
              </div>

              <!-- Input Row 2 -->
              <div class="flex items-center gap-3 mb-3">
                <div class="w-2 h-2 rounded-full bg-slate-200 group-hover:bg-emerald-500 transition-colors duration-300 delay-[1500ms]"></div>
                 <div class="h-6 bg-slate-100 rounded-md w-[50%] flex items-center px-3 gap-1 overflow-hidden">
                  <div class="w-1.5 h-1.5 bg-slate-400 rounded-full opacity-0 group-hover:animate-type-dot" style="animation-delay: 1600ms"></div>
                  <div class="w-1.5 h-1.5 bg-slate-400 rounded-full opacity-0 group-hover:animate-type-dot" style="animation-delay: 1700ms"></div>
                  <div class="w-1.5 h-1.5 bg-slate-400 rounded-full opacity-0 group-hover:animate-type-dot" style="animation-delay: 1800ms"></div>
                  <div class="w-0.5 h-4 bg-blue-500 animate-pulse hidden group-hover:block ml-0.5"></div>
                </div>
                 <div class="ml-auto opacity-0 group-hover:opacity-100 transition-all duration-300 delay-[2000ms] transform translate-y-1 group-hover:translate-y-0">
                  <svg class="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
                </div>
              </div>

              <!-- Input Row 3 -->
              <div class="flex items-center gap-3">
                <div class="w-2 h-2 rounded-full bg-slate-200 group-hover:bg-blue-500 transition-colors duration-300 delay-[2500ms]"></div>
                 <div class="h-6 bg-slate-100 rounded-md w-[85%] flex items-center px-3 gap-1 overflow-hidden">
                  <div class="w-1.5 h-1.5 bg-slate-400 rounded-full opacity-0 group-hover:animate-type-dot" style="animation-delay: 2600ms"></div>
                  <div class="w-1.5 h-1.5 bg-slate-400 rounded-full opacity-0 group-hover:animate-type-dot" style="animation-delay: 2700ms"></div>
                  <div class="w-1.5 h-1.5 bg-slate-400 rounded-full opacity-0 group-hover:animate-type-dot" style="animation-delay: 2800ms"></div>
                  <div class="w-1.5 h-1.5 bg-slate-400 rounded-full opacity-0 group-hover:animate-type-dot" style="animation-delay: 2900ms"></div>
                  <div class="w-1.5 h-1.5 bg-slate-400 rounded-full opacity-0 group-hover:animate-type-dot" style="animation-delay: 3000ms"></div>
                  <div class="w-1.5 h-1.5 bg-slate-400 rounded-full opacity-0 group-hover:animate-type-dot" style="animation-delay: 3100ms"></div>
                  <div class="w-0.5 h-4 bg-blue-500 animate-pulse hidden group-hover:block ml-0.5"></div>
                </div>
                <!-- Processing Indicator (Only on Hover) -->
                <div class="ml-auto">
                   <div class="w-4 h-4 border-2 border-blue-100 border-t-blue-500 rounded-full animate-spin opacity-0 group-hover:opacity-100 delay-[3500ms] duration-300 transition-opacity"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- #1: Characteristics (Small Card) -->
        <div class="feature-card group lg:col-start-2 lg:col-end-3 lg:row-start-1 lg:row-end-2 bg-white">
          <div class="feature-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
          </div>
          <h3 class="feature-title">{{ features[1].title }}</h3>
          <p class="feature-description">{{ features[1].description }}</p>
        </div>

        <!-- #2: Symptoms (Small Card) -->
        <div class="feature-card group lg:col-start-3 lg:col-end-4 lg:row-start-1 lg:row-end-2 bg-white">
          <div class="feature-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
          </div>
          <h3 class="feature-title">{{ features[2].title }}</h3>
          <p class="feature-description">{{ features[2].description }}</p>
        </div>

        <!-- #3: Epidemic Curve (Wide Card) with Dynamic Chart Animation -->
        <div class="feature-card group lg:col-start-2 lg:col-end-4 lg:row-start-2 lg:row-end-3 bg-white">
          <div class="flex flex-col md:flex-row h-full">
            <!-- Left: Text Info -->
            <div class="flex-1 flex flex-col justify-between p-2 md:pr-6">
              <div>
                <div class="w-12 h-12 bg-slate-200 text-slate-900 rounded-xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-slate-900 group-hover:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="20" x2="12" y2="10"></line><line x1="18" y1="20" x2="18" y2="4"></line><line x1="6" y1="20" x2="6" y2="16"></line></svg>
                </div>
                <h3 class="text-xl font-bold text-slate-900 mb-3 tracking-tight">{{ features[3].title }}</h3>
                <p class="text-[0.95rem] text-slate-500 leading-relaxed">{{ features[3].description }}</p>
              </div>
            </div>
          
            <!-- Right: Animated Bar Chart -->
            <div class="flex-1 mt-6 md:mt-0 flex items-center justify-center md:justify-end">
              <div class="w-full max-w-[200px] aspect-[16/10] bg-slate-50 rounded-2xl border border-slate-100 relative overflow-hidden group-hover:border-blue-100 transition-colors p-4 flex items-end justify-between gap-2 shadow-inner">
                <!-- Background Grid Lines -->
                <div class="absolute inset-0 flex flex-col justify-between p-4 opacity-30 pointer-events-none z-0">
                  <div class="w-full h-px bg-slate-300 border-t border-dashed"></div>
                  <div class="w-full h-px bg-slate-300 border-t border-dashed"></div>
                  <div class="w-full h-px bg-slate-300 border-t border-dashed"></div>
                  <div class="w-full h-px bg-slate-300 border-t border-dashed"></div>
                </div>

                <!-- Bars Container -->
                <div class="relative z-10 w-full h-full flex items-end justify-between gap-1.5">
                  <div class="flex-1 bg-blue-200 rounded-t-sm relative group-hover:bg-blue-500 transition-all duration-500 ease-out h-[30%] group-hover:h-[40%] delay-[0ms] shadow-sm"></div>
                  <div class="flex-1 bg-blue-200 rounded-t-sm relative group-hover:bg-blue-500 transition-all duration-500 ease-out h-[50%] group-hover:h-[85%] delay-[100ms] shadow-sm"></div>
                  <div class="flex-1 bg-blue-200 rounded-t-sm relative group-hover:bg-blue-500 transition-all duration-500 ease-out h-[40%] group-hover:h-[60%] delay-[200ms] shadow-sm"></div>
                  <div class="flex-1 bg-blue-200 rounded-t-sm relative group-hover:bg-blue-500 transition-all duration-500 ease-out h-[60%] group-hover:h-[90%] delay-[150ms] shadow-sm"></div>
                  <div class="flex-1 bg-blue-200 rounded-t-sm relative group-hover:bg-blue-500 transition-all duration-500 ease-out h-[20%] group-hover:h-[45%] delay-[300ms] shadow-sm"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- #4: Case Control (Medium Card) -->
        <div class="feature-card group lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4">
          <div class="feature-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </div>
          <h3 class="feature-title">{{ features[4].title }}</h3>
          <p class="feature-description">{{ features[4].description }}</p>
        </div>

        <!-- #5: Cohort (Medium Card) -->
        <div class="feature-card group lg:col-start-2 lg:col-end-4 lg:row-start-3 lg:row-end-4">
          <div class="feature-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
          </div>
          <h3 class="feature-title">{{ features[5].title }}</h3>
          <p class="feature-description">{{ features[5].description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
interface Props {
  features?: any[];
}

withDefaults(defineProps<Props>(), {
  features: () => []
});
</script>

<style scoped>
/* 반복 스타일 추출 - @apply 활용 */
.feature-card {
  @apply relative flex flex-col bg-white/50 backdrop-blur-sm rounded-[2.5xl] p-8 
         border border-slate-200/60 transition-all duration-500 shadow-sm 
         hover:-translate-y-2 hover:shadow-premium hover:border-blue-200/50 
         overflow-hidden z-10;
}

/* 카드 내부 그라데이션 오버레이 */
.feature-card::after {
  content: '';
  @apply absolute inset-0 opacity-0 transition-opacity duration-500 pointer-events-none;
  background: radial-gradient(800px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(59, 130, 246, 0.06), transparent 40%);
}

.feature-card:hover::after {
  @apply opacity-100;
}

.feature-icon {
  @apply w-14 h-14 bg-slate-100 text-slate-600 rounded-2xl 
         flex items-center justify-center mb-6 transition-all duration-500 ease-out
         shadow-inner-soft border border-slate-200/50;
}

/* 아이콘 호버 효과: 부모(.group) 호버 시 스타일 변경 */
.group:hover .feature-icon {
  @apply bg-blue-600 text-white scale-110 rotate-3 shadow-lg ring-4 ring-blue-100;
}

.feature-title {
  @apply text-[1.35rem] font-bold text-slate-900 mb-3 tracking-tight transition-colors duration-300;
}

.group:hover .feature-title {
  @apply text-blue-700;
}

.feature-description {
  @apply text-body-lg text-slate-500 leading-relaxed transition-colors duration-300;
}

.group:hover .feature-description {
  @apply text-slate-600;
}

</style>

