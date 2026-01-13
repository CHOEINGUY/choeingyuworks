<template>
  <BaseModal
    :modelValue="isOpen"
    :title="$t('caseSeries.guide.title')"
    :subtitle="$t('caseSeries.guide.subtitle')"
    icon="insights"
    size="lg"
    @update:modelValue="(val: boolean) => !val && $emit('close')"
    @close="$emit('close')"
  >
    <!-- Scrollable Content -->
    <div class="space-y-10 custom-scrollbar">
      
      <!-- Concept -->
      <section>
        <div class="flex items-start gap-4 mb-6">
          <div class="w-8 h-8 bg-slate-900 text-white flex items-center justify-center text-sm font-bold shrink-0 rounded-sm">1</div>
          <div>
            <h4 class="text-xl font-bold text-slate-900 mb-2">{{ $t('caseSeries.guide.sections.overview.title') }}</h4>
            <p class="text-slate-500 text-body leading-relaxed">
              <i18n-t keypath="caseSeries.guide.sections.overview.description" tag="span">
                <template #cases>
                  <span class="text-indigo-600 font-bold">{{ $t('caseSeries.guide.sections.overview.cases') }}</span>
                </template>
              </i18n-t>
            </p>
          </div>
        </div>
      </section>

      <!-- Metrics -->
      <section>
        <div class="flex items-center gap-3 mb-4 border-b border-slate-100 pb-2">
          <span class="text-indigo-600 font-bold text-lg">02</span>
          <h4 class="text-lg font-bold text-slate-900 tracking-tight">{{ $t('caseSeries.guide.sections.exposureRate.title') }}</h4>
        </div>
        
        <div class="bg-indigo-50 p-6 border border-indigo-100 mb-6 text-center rounded-sm">
           <div class="text-lg text-slate-800 font-medium font-math mb-3">
             {{ $t('caseSeries.guide.sections.exposureRate.formula.rate') }} = ( <span class="text-indigo-700 font-bold">{{ $t('caseSeries.guide.sections.exposureRate.formula.exposed') }}</span> / <span class="text-slate-600 font-bold">{{ $t('caseSeries.guide.sections.exposureRate.formula.total') }}</span> ) × 100
           </div>
           <p class="text-sm text-indigo-600">{{ $t('caseSeries.guide.sections.exposureRate.description') }}</p>
        </div>

        <ul class="space-y-4 text-sm text-slate-600">
           <li class="flex items-start gap-3">
             <span class="material-icons text-indigo-500 text-sm mt-[3px]">check_circle</span>
             <span>
               <strong class="text-slate-900">{{ $t('caseSeries.guide.sections.exposureRate.interpretation.high.label') }}</strong> {{ $t('caseSeries.guide.sections.exposureRate.interpretation.high.desc') }}
             </span>
           </li>
           <li class="flex items-start gap-3">
             <span class="material-icons text-slate-400 text-sm mt-[3px]">info</span>
             <span>
               <strong class="text-slate-900">{{ $t('caseSeries.guide.sections.exposureRate.interpretation.limit.label') }}</strong> {{ $t('caseSeries.guide.sections.exposureRate.interpretation.limit.desc') }}
             </span>
           </li>
        </ul>
      </section>

    </div>
    
    <!-- Footer -->
    <template #footer>
      <BaseButton
        variant="primary"
        size="lg"
        @click="$emit('close')"
        rounded="sm"
      >
        {{ $t('caseSeries.guide.sections.ok') }}
      </BaseButton>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import BaseModal from '../../Common/BaseModal.vue';
import BaseButton from '../../Common/BaseButton.vue';

defineProps<{
  isOpen: boolean;
}>();

defineEmits<{
  (e: 'close'): void;
}>();
</script>

<style scoped>
/* Premium Font Stacks */
.font-premium {
  font-family: "Pretendard", -apple-system, BlinkMacSystemFont, system-ui, Roboto, "Helvetica Neue", "Segoe UI", "Apple SD Gothic Neo", "Malgun Gothic", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", sans-serif;
  letter-spacing: -0.01em;
}

/* Math Font for Variables */
.font-math {
  font-family: "Times New Roman", Times, serif;
  font-style: italic;
}
</style>
