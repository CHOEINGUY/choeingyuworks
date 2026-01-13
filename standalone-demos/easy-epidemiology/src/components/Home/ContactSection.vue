<template>
  <footer class="bg-slate-900 text-white py-20 pb-10">
    <div class="max-w-[1200px] mx-auto px-6">
      <div class="grid grid-cols-1 md:grid-cols-[2fr,1fr,1fr] gap-12 md:gap-16 mb-20">
        <!-- Brand / Contact -->
        <div class="flex flex-col">
          <h3 class="text-2xl font-extrabold mb-3 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">{{ $t('home.contact.title') }}</h3>
          <p class="text-slate-400 mb-8 text-[0.95rem]">{{ $t('home.contact.center') }}</p>
          <div class="flex flex-col gap-2">
            <div class="flex gap-3 text-sm">
              <span class="text-slate-500 shrink-0 min-w-[3rem]">{{ $t('home.contact.operate') }}</span>
              <span class="text-slate-300">{{ $t('home.system.deptName') }}</span>
            </div>
            <div class="flex gap-3 text-sm">
              <span class="text-slate-500 shrink-0 min-w-[3rem]">{{ $t('home.contact.dept') }}</span>
              <span class="text-slate-300">{{ $t('home.system.centerName') }}</span>
            </div>
          </div>
        </div>

        <!-- Technical Support -->
        <div class="flex flex-col">
          <h4 class="text-[0.95rem] font-bold uppercase tracking-wider text-slate-400 mb-6">{{ $t('home.contact.techSupport') }}</h4>
          <ul class="flex flex-col gap-4">
            <li class="flex flex-col gap-0.5">
              <span class="text-[0.8rem] text-slate-500">{{ $t('home.contact.names.yang') }} {{ $t('home.contact.roles.chief') }}</span>
            </li>
            <li class="flex flex-col gap-0.5">
              <span class="text-[0.8rem] text-slate-500">{{ $t('home.contact.names.choi') }} {{ $t('home.contact.roles.researcher') }}</span>
              <span class="text-slate-200 text-[0.95rem]">010-3323-7008</span>
            </li>
          </ul>
        </div>
        
        <!-- Email Support -->
        <div class="flex flex-col">
          <h4 class="text-[0.95rem] font-bold uppercase tracking-wider text-slate-400 mb-6">{{ $t('home.contact.emailSupport') }}</h4>
          <ul class="flex flex-col gap-3">
             <li class="text-slate-200 text-[0.95rem]">chldlsrb07@gmail.com</li>
          </ul>
        </div>
      </div>
      
      <div class="border-t border-slate-800 pt-8 text-center text-slate-500 text-[0.85rem]">
        <p>&copy; 2026 Easy-Epidemiology Web. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
// No props needed now as we use i18n directly
</script>

<style scoped>
/* 반복 스타일 추출 - @apply 활용 */
.footer-heading {
  @apply text-[0.95rem] font-bold uppercase tracking-wider text-slate-400 mb-6;
}

.contact-item {
  @apply flex flex-col gap-0.5;
}

.contact-label {
  @apply text-[0.8rem] text-slate-500;
}

.contact-value {
  @apply text-slate-200 text-[0.95rem];
}

/* 이메일 호버 효과 */
.email-link {
  @apply text-slate-200 text-[0.95rem] transition-colors duration-300 hover:text-blue-400;
}
</style>

