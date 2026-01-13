<template>
  <div class="relative">
    <button
      @click="toggleDropdown"
      class="flex items-center gap-2 pl-3 pr-4 py-1.5 rounded-full bg-white text-slate-600 hover:text-blue-600 border border-slate-200 hover:border-blue-200 shadow-sm hover:shadow transition-all duration-200 group"
      :title="currentLocaleLabel"
    >
      <span class="material-icons text-[18px] text-slate-400 group-hover:text-blue-500 transition-colors">language</span>
      <span class="text-[13px] font-semibold">{{ currentLocale === 'ko' ? '한국어' : 'English' }}</span>
    </button>

    <Transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <div
        v-if="isOpen"
        class="absolute right-0 w-32 bg-white rounded-lg shadow-lg border border-slate-100 py-1 z-50 overflow-hidden"
        :class="direction === 'up' ? 'bottom-full mb-2' : 'top-full mt-1'"
      >
        <button
          v-for="locale in availableLocales"
          :key="locale.code"
          @click="changeLocale(locale.code)"
          class="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-between"
          :class="{ 'bg-blue-50 text-blue-600': currentLocale === locale.code }"
        >
          <span>{{ locale.label }}</span>
          <span v-if="currentLocale === locale.code" class="material-icons text-[14px]">check</span>
        </button>
      </div>
    </Transition>
    
    <!-- Backdrop to close -->
    <div 
      v-if="isOpen" 
      class="fixed inset-0 z-40 bg-transparent cursor-default" 
      @click="isOpen = false"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';

interface Props {
  direction?: 'up' | 'down';
}

const props = withDefaults(defineProps<Props>(), {
  direction: 'down'
});

const { locale } = useI18n();
const isOpen = ref(false);

const availableLocales = [
  { code: 'ko', label: '한국어' },
  { code: 'en', label: 'English' }
];

const currentLocale = computed(() => locale.value);
const currentLocaleLabel = computed(() => {
  return availableLocales.find(l => l.code === currentLocale.value)?.label || currentLocale.value;
});

function toggleDropdown() {
  isOpen.value = !isOpen.value;
}

function changeLocale(code: string) {
  locale.value = code;
  isOpen.value = false;
  // Save to localStorage
  localStorage.setItem('user-locale', code);
}
</script>
