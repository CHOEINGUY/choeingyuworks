<template>
  <div class="w-full flex justify-between items-center px-5 py-4 border-b border-slate-100">
    <div class="flex gap-5">
      <div class="flex items-center gap-2.5">
        <label class="font-semibold text-slate-700 text-sm">{{ $t('cohortStudy.controls.fontSize') }}:</label>
        <div class="relative inline-block">
          <button 
            class="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded text-slate-600 text-sm hover:bg-slate-100 hover:border-slate-300 transition-colors min-w-[60px]" 
            @click="cycleFontSize" 
            @mouseenter="handleFontSizeMouseEnter" 
            @mouseleave="handleFontSizeMouseLeave"
          >
            {{ fontSizeButtonText }}
          </button>
          
          <!-- Tooltip -->
          <Transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="opacity-0 -translate-y-1"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition duration-150 ease-in"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 -translate-y-1"
          >
            <div v-if="activeTooltip === 'fontSize'" class="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-2 bg-slate-800 text-white text-xs rounded shadow-lg whitespace-nowrap z-50 font-sans">
              {{ tooltipText }}
              <!-- Arrow -->
              <div class="absolute bottom-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-b-slate-800"></div>
            </div>
          </Transition>
        </div>
      </div>
    </div>
    <div class="text-sm font-medium text-slate-500">
    <div class="text-sm font-medium text-slate-500">
      <p class="m-0">{{ $t('cohortStudy.controls.totalCount', { count: rowCount }) }}</p>
    </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps<{
  fontSize: number;
  rowCount: number;
}>();

const emit = defineEmits<{
  (e: 'update:fontSize', value: number): void;
}>();

const fontSizes = [12, 14, 16];
const fontSizeLabels = ['작게', '보통', '크게'];

const fontSizeButtonText = computed(() => {
  const currentIndex = fontSizes.indexOf(props.fontSize);
  if (currentIndex === 0) return t('cohortStudy.controls.small');
  if (currentIndex === 1) return t('cohortStudy.controls.medium');
  if (currentIndex === 2) return t('cohortStudy.controls.large');
  return t('cohortStudy.controls.medium');
});

// 툴팁 상태 관리
const activeTooltip = ref<string | null>(null);
const tooltipText = ref('');

const showTooltip = (key: string, text: string) => {
  activeTooltip.value = key;
  tooltipText.value = text;
};

const hideTooltip = () => {
  activeTooltip.value = null;
};

const handleFontSizeMouseEnter = () => {
  const currentIndex = fontSizes.indexOf(props.fontSize);
  const nextIndex = (currentIndex + 1) % fontSizes.length;
  const nextFontSize = fontSizeButtonText.value;
  showTooltip('fontSize', t('cohortStudy.controls.fontSizeTooltip', { size: nextFontSize }));
};

const handleFontSizeMouseLeave = () => {
  hideTooltip();
};

const getNextValue = (currentValue: number, valueArray: number[]) => {
  const currentIndex = valueArray.indexOf(currentValue);
  const nextIndex = (currentIndex + 1) % valueArray.length;
  return valueArray[nextIndex];
};

const cycleFontSize = () => {
  const nextFontSize = getNextValue(props.fontSize, fontSizes);
  emit('update:fontSize', nextFontSize);
  // handleFontSizeMouseEnter(); // 마우스가 위에 있으므로 바로 갱신하면 좋음
};
</script>
