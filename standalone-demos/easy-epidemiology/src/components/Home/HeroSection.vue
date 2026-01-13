<template>
  <section class="relative min-h-[85vh] flex items-center justify-center bg-white overflow-hidden py-20">
    <!-- Animated Background -->
    <div class="absolute inset-0 z-0 pointer-events-none">
      <div class="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.03)_1px,transparent_1px)] bg-[length:50px_50px] [mask-image:radial-gradient(circle_at_center,black,transparent_80%)]"></div>
      <div class="absolute -inset-[50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.03),transparent_60%)] animate-heroPulse"></div>
    </div>

    <div class="relative z-10 max-w-[1200px] mx-auto px-6">
      <div class="max-w-[900px] mx-auto text-center">
        <!-- Floating Badge -->
        <div class="mb-8">
          <span class="inline-flex items-center gap-2 px-4 py-2 bg-white/80 border border-slate-200 rounded-full text-sm font-medium text-slate-600 backdrop-blur-[4px] shadow-sm">
            <span class="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
            {{ subtitle }}
          </span>
        </div>
        
        <!-- Main Title -->
        <h1 class="text-[3.5rem] md:text-[5rem] font-black text-[#0f172a] leading-[1.1] tracking-[-0.03em] mb-8">
          <span class="block">{{ title.split(' ')[0] }}</span>
          <span class="text-blue-600 block">{{ title.split(' ').slice(1).join(' ') }}</span>
        </h1>
        
        <!-- Description -->
        <p class="text-[1.25rem] md:text-[1.4rem] text-slate-500 leading-relaxed max-w-[680px] mx-auto font-medium mb-10">{{ description }}</p>

        <!-- Manual Button -->
        <div class="flex justify-center">
          <router-link 
            to="/manual" 
            class="inline-flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-600 font-bold rounded-full hover:bg-slate-50 hover:border-blue-200 hover:text-blue-600 transition-all shadow-sm hover:shadow-md group"
          >
            <span class="material-icons text-xl text-slate-400 group-hover:text-blue-500 transition-colors">menu_book</span>
            <span>{{ $t('home.hero.manualBtn') }}</span>
          </router-link>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Props {
  title?: string;
  subtitle?: string;
  description?: string;
}

withDefaults(defineProps<Props>(), {
  title: '',
  subtitle: '',
  description: ''
});
</script>

<style scoped>
/* Scoped CSS removed as all styles are now handled by Tailwind utility classes */
</style>
