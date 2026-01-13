<template>
  <BaseModal
    :modelValue="isOpen"
    :title="$t('caseControl.guide.title')"
    :subtitle="$t('caseControl.guide.subtitle')"
    icon="school"
    size="xl"
    @update:modelValue="(val: boolean) => !val && $emit('close')"
    @close="$emit('close')"
  >
    <!-- Scrollable Content -->
    <div class="space-y-10 custom-scrollbar">
      
      <!-- 1. 2x2 Table Visual -->
      <section>
        <div class="flex items-start gap-4 mb-6">
          <div class="w-8 h-8 bg-slate-900 text-white flex items-center justify-center text-sm font-bold shrink-0 rounded-sm">1</div>
          <div>
            <h4 class="text-xl font-bold text-slate-900 mb-2">{{ $t('caseControl.guide.sections.contingencyTable.title') }}</h4>
            <p class="text-slate-500 text-body leading-relaxed">
              {{ $t('caseControl.guide.sections.contingencyTable.description') }}
            </p>
          </div>
        </div>
        
        <div class="grid grid-cols-[120px_1fr_1fr_110px] gap-px bg-slate-200 border border-slate-200 overflow-hidden text-center text-sm shadow-sm rounded-sm">
          <!-- Header Row -->
          <div class="bg-slate-50 p-4 font-bold text-slate-700 flex items-center justify-center uppercase tracking-wider text-xs">{{ $t('caseControl.guide.sections.contingencyTable.headers.category') }}</div>
          <div class="bg-blue-50/50 p-4 font-bold text-blue-900">{{ $t('caseControl.guide.sections.contingencyTable.headers.case') }}</div>
          <div class="bg-emerald-50/50 p-4 font-bold text-emerald-900">{{ $t('caseControl.guide.sections.contingencyTable.headers.control') }}</div>
          <div class="bg-slate-50 p-4 font-bold text-slate-700">{{ $t('caseControl.guide.sections.contingencyTable.headers.total') }}</div>

          <!-- Exposed Row -->
          <div class="bg-white p-4 font-bold text-slate-700 flex flex-col justify-center">
            <span class="text-base">{{ $t('caseControl.guide.sections.contingencyTable.rows.exposed.label') }}</span>
            <span class="text-xs text-slate-400 font-normal mt-1">{{ $t('caseControl.guide.sections.contingencyTable.rows.exposed.sub') }}</span>
          </div>
          <div class="bg-white p-6 relative group font-math hover:bg-blue-50 transition-colors">
            <span class="text-3xl font-bold text-slate-800">a</span>
            <span class="absolute text-[10px] text-slate-400 bottom-2 right-3 font-premium uppercase tracking-wide not-italic">{{ $t('caseControl.guide.sections.contingencyTable.cells.a') }}</span>
          </div>
          <div class="bg-white p-6 relative group font-math hover:bg-emerald-50 transition-colors">
            <span class="text-3xl font-bold text-slate-800">b</span>
            <span class="absolute text-[10px] text-slate-400 bottom-2 right-3 font-premium uppercase tracking-wide not-italic">{{ $t('caseControl.guide.sections.contingencyTable.cells.b') }}</span>
          </div>
          <div class="bg-slate-50 p-6 text-slate-500 font-medium font-math flex items-center justify-center text-lg italic whitespace-nowrap">a + b</div>

          <!-- Unexposed Row -->
          <div class="bg-white p-4 font-bold text-slate-700 flex flex-col justify-center">
            <span class="text-base">{{ $t('caseControl.guide.sections.contingencyTable.rows.unexposed.label') }}</span>
            <span class="text-xs text-slate-400 font-normal mt-1">{{ $t('caseControl.guide.sections.contingencyTable.rows.unexposed.sub') }}</span>
          </div>
          <div class="bg-white p-6 relative group font-math hover:bg-blue-50 transition-colors">
            <span class="text-3xl font-bold text-slate-800">c</span>
            <span class="absolute text-[10px] text-slate-400 bottom-2 right-3 font-premium uppercase tracking-wide not-italic">{{ $t('caseControl.guide.sections.contingencyTable.cells.c') }}</span>
          </div>
          <div class="bg-white p-6 relative group font-math hover:bg-emerald-50 transition-colors">
            <span class="text-3xl font-bold text-slate-800">d</span>
            <span class="absolute text-[10px] text-slate-400 bottom-2 right-3 font-premium uppercase tracking-wide not-italic">{{ $t('caseControl.guide.sections.contingencyTable.cells.d') }}</span>
          </div>
          <div class="bg-slate-50 p-6 text-slate-500 font-medium font-math flex items-center justify-center text-lg italic whitespace-nowrap">c + d</div>

          <!-- Total Row -->
          <div class="bg-slate-50 p-4 font-bold text-slate-700">{{ $t('caseControl.guide.sections.contingencyTable.rows.total') }}</div>
          <div class="bg-slate-50 p-4 text-slate-500 font-medium font-math text-lg italic">a + c</div>
          <div class="bg-slate-50 p-4 text-slate-500 font-medium font-math text-lg italic">b + d</div>
          <div class="bg-slate-50 p-4 text-slate-700 font-bold font-math text-lg italic">N</div>
        </div>
      </section>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
        <!-- 2. Odds Ratio -->
        <section>
          <div class="flex items-center gap-3 mb-4 border-b border-slate-100 pb-2">
            <span class="text-indigo-600 font-bold text-lg">02</span>
            <h4 class="text-lg font-bold text-slate-900 tracking-tight">{{ $t('caseControl.guide.sections.or.title') }}</h4>
          </div>
          
          <div class="bg-slate-50 p-4 border border-slate-200 mb-6 font-math text-center text-slate-800 text-xl rounded-sm">
            <span class="not-italic font-bold text-slate-600 pr-2 font-premium text-sm">{{ $t('caseControl.guide.sections.or.formula.label') }}:</span> 
            OR = ( <span class="text-blue-700">a</span> × <span class="text-emerald-700">d</span> ) / ( <span class="text-emerald-700">b</span> × <span class="text-blue-700">c</span> )
          </div>
          
          <ul class="space-y-6 text-sm text-slate-600">
            <li class="flex flex-col gap-2">
              <span class="font-bold text-slate-900 text-xs uppercase tracking-wider text-opacity-80">{{ $t('caseControl.guide.sections.or.def.title') }}</span>
              <span class="leading-relaxed text-slate-700">{{ $t('caseControl.guide.sections.or.def.desc') }}</span>
            </li>
            <li class="flex flex-col gap-2">
              <span class="font-bold text-slate-900 text-xs uppercase tracking-wider text-opacity-80">{{ $t('caseControl.guide.sections.or.interpretation.title') }}</span>
              <div class="space-y-0 text-sm border-l-2 border-slate-200 pl-4">
                <div class="py-2 flex items-center gap-3 border-b border-slate-50"><span class="font-bold text-slate-800 w-16">{{ $t('caseControl.guide.sections.or.interpretation.risk.label') }}</span> <span class="text-slate-600">{{ $t('caseControl.guide.sections.or.interpretation.risk.desc') }}</span></div>
                <div class="py-2 flex items-center gap-3 border-b border-slate-50"><span class="font-bold text-slate-800 w-16">{{ $t('caseControl.guide.sections.or.interpretation.protective.label') }}</span> <span class="text-slate-600">{{ $t('caseControl.guide.sections.or.interpretation.protective.desc') }}</span></div>
                <div class="py-2 flex items-center gap-3"><span class="font-bold text-slate-800 w-16">{{ $t('caseControl.guide.sections.or.interpretation.null.label') }}</span> <span class="text-slate-500">{{ $t('caseControl.guide.sections.or.interpretation.null.desc') }}</span></div>
              </div>
            </li>
          </ul>
        </section>

        <!-- 3. P-value -->
        <section>
          <div class="flex items-center gap-3 mb-4 border-b border-slate-100 pb-2">
            <span class="text-pink-600 font-bold text-lg">03</span>
            <h4 class="text-lg font-bold text-slate-900 tracking-tight">{{ $t('caseControl.guide.sections.pvalue.title') }}</h4>
          </div>
          
          <div class="space-y-6 text-sm text-slate-600 h-full">
            <p class="leading-relaxed text-slate-700">
              <i18n-t keypath="caseControl.guide.sections.pvalue.description" tag="span">
                <template #highlight>
                  <span class="font-bold text-slate-900 border-b-2 border-yellow-300">0.05 (5%)</span>
                </template>
              </i18n-t>
            </p>
            
            <div class="bg-white p-0 text-sm mt-4">
              <p class="font-bold text-slate-900 mb-3 text-xs uppercase tracking-wider text-opacity-80">{{ $t('caseControl.guide.sections.pvalue.method.title') }}</p>
              <div class="space-y-4">
                <div class="flex items-start gap-4 group">
                  <div class="w-1 h-1 bg-slate-300 rounded-full mt-2 group-hover:bg-blue-500 transition-colors"></div>
                  <div>
                    <span class="font-bold text-slate-800 block mb-0.5">{{ $t('caseControl.guide.sections.pvalue.method.chiSquare.label') }}</span>
                    <span class="text-xs text-slate-400">{{ $t('caseControl.guide.sections.pvalue.method.chiSquare.desc') }}</span>
                  </div>
                </div>
                <div class="flex items-start gap-4 group">
                  <div class="w-1 h-1 bg-slate-300 rounded-full mt-2 group-hover:bg-blue-500 transition-colors"></div>
                  <div>
                    <span class="font-bold text-slate-800 block mb-0.5">{{ $t('caseControl.guide.sections.pvalue.method.fisher.label') }}</span>
                    <span class="text-xs text-slate-400">{{ $t('caseControl.guide.sections.pvalue.method.fisher.desc') }}</span>
                  </div>
                </div>
                 <div class="flex items-start gap-4 group">
                  <div class="w-1 h-1 bg-slate-300 rounded-full mt-2 group-hover:bg-blue-500 transition-colors"></div>
                  <div>
                    <span class="font-bold text-slate-800 block mb-0.5">{{ $t('caseControl.guide.sections.pvalue.method.yates.label') }}</span>
                    <span class="text-xs text-slate-400">{{ $t('caseControl.guide.sections.pvalue.method.yates.desc') }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- 4. Confidence Interval -->
      <section>
        <div class="flex items-start gap-4 mb-6">
          <div class="w-8 h-8 bg-slate-900 text-white flex items-center justify-center text-sm font-bold shrink-0 rounded-sm">4</div>
          <div>
            <h4 class="text-xl font-bold text-slate-900 mb-2">{{ $t('caseControl.guide.sections.ci.title') }}</h4>
            <p class="text-slate-500 text-body leading-relaxed">
              <i18n-t keypath="caseControl.guide.sections.ci.description" tag="span">
                <template #includes>
                  <span class="font-bold text-slate-900 border-b-2 border-slate-200">{{ $t('caseControl.guide.sections.ci.includesOne') }}</span>
                </template>
              </i18n-t>
            </p>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-0 border border-slate-200 rounded-sm overflow-hidden">
          <div class="bg-slate-50 p-6 flex flex-col items-center text-center border-r border-slate-200 group hover:bg-red-50/10 transition-colors">
            <div class="font-bold text-slate-900 mb-2">{{ $t('caseControl.guide.sections.ci.significant.label') }}</div>
            <div class="text-xs text-slate-500 mb-4">{{ $t('caseControl.guide.sections.ci.significant.desc') }}</div>
            <div class="font-mono-premium text-lg text-slate-800 bg-white border border-slate-200 px-4 py-2 w-full">1.5 ~ 4.2</div>
          </div>
          
          <div class="bg-white p-6 flex flex-col items-center text-center group hover:bg-slate-50 transition-colors">
            <div class="font-bold text-slate-400 mb-2">{{ $t('caseControl.guide.sections.ci.notSignificant.label') }}</div>
            <div class="text-xs text-slate-400 mb-4">{{ $t('caseControl.guide.sections.ci.notSignificant.desc') }}</div>
            <div class="font-mono-premium text-lg text-slate-400 bg-slate-50 border border-slate-100 px-4 py-2 w-full">0.8 ~ 2.1</div>
          </div>
        </div>
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
        {{ $t('caseControl.guide.sections.ok') }}
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

.font-mono-premium {
  font-family: "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace;
  font-variant-numeric: tabular-nums;
}

/* Math Font for Variables */
.font-math {
  font-family: "Times New Roman", Times, serif;
  font-style: italic;
}
</style>
