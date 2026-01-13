<template>
  <div class="mx-auto w-full max-w-4xl">
    <div class="flex flex-col gap-3">
      <div class="flex items-center gap-2 text-lg font-medium text-slate-800">
        <span class="w-1.5 h-1.5 rounded-full bg-slate-800"></span>
        <span>{{ $t('epidemicCurve.suspectedFood.title') }}</span>
        <div class="relative inline-block">
          <span 
            v-if="analysisStatus" 
            ref="analysisTooltipRef"
            class="px-2 py-0.5 rounded-full text-xs font-medium cursor-help whitespace-nowrap" 
            :class="{
              'bg-green-50 text-green-700 border border-green-200': analysisStatus.type === 'success',
              'bg-orange-50 text-orange-700 border border-orange-200': analysisStatus.type === 'warning',
              'bg-red-50 text-red-700 border border-red-200': analysisStatus.type === 'error'
            }"
            @mouseenter="showAnalysisTooltip = true"
            @mouseleave="showAnalysisTooltip = false"
          >
            {{ analysisStatus.message }}
          </span>
          <div 
            v-if="showAnalysisTooltip" 
            class="fixed bg-slate-800 text-white px-3 py-2 rounded-lg text-xs whitespace-nowrap z-[1050] shadow-xl"
            :style="analysisTooltipStyle"
          >
            {{ getAnalysisStatusTooltip(analysisStatus) }}
          </div>
        </div>
      </div>
      <div class="flex gap-3">
        <div class="flex-1 relative">
          <div ref="dropdownRef" class="relative">
            <div class="flex items-center border border-slate-300 rounded-lg bg-white cursor-pointer hover:border-blue-400 transition-colors" @click="toggleDropdown">
                <input
                  v-model="suspectedFood"
                  type="text"
                  class="flex-1 border-none py-2.5 px-3 text-sm outline-none bg-transparent cursor-pointer disabled:bg-slate-100 disabled:cursor-not-allowed"
                  :placeholder="$t('epidemicCurve.suspectedFood.placeholder')"
                  @input="onSuspectedFoodChange"
                  :disabled="!hasAnalysisResults"
                />
              <span class="px-3 text-slate-500 text-xs">▼</span>
            </div>
            
            <div v-if="isDropdownOpen" class="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-[1000] max-h-[300px] overflow-y-auto">
              <div class="px-3 py-2.5 bg-slate-50 border-b border-slate-100 text-xs font-medium text-slate-500">
                <span>{{ $t('epidemicCurve.suspectedFood.multiSelectTitle') }}</span>
              </div>
              <div 
                v-for="food in (backgroundAnalysisFoods.length > 0 ? backgroundAnalysisFoods : sortedFoodItems)" 
                :key="food.item"
                class="flex items-center gap-2.5 px-3 py-2.5 cursor-pointer hover:bg-blue-50 transition-colors border-b border-slate-50 last:border-0"
                @click="toggleFoodSelection(food.item)"
              >
                <input
                  type="checkbox"
                  :checked="isFoodSelected(food.item)"
                  @click.stop
                  @change="toggleFoodSelection(food.item)"
                  class="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <span class="flex-1 text-sm text-slate-700">{{ food.item }}</span>
                <span v-if="food.pValue !== null" class="text-xs text-slate-500">
                  p={{ food.pValue < 0.001 ? '<0.001' : food.pValue.toFixed(3) }}
                  <span v-if="food.oddsRatio && food.oddsRatio !== 'N/A'" class="text-blue-600 font-medium ml-1">
                    (OR: {{ food.oddsRatio }})
                  </span>
                  <span v-else-if="food.relativeRisk && food.relativeRisk !== 'N/A'" class="text-blue-600 font-medium ml-1">
                    (RR: {{ food.relativeRisk }})
                  </span>
                </span>
                <span v-else-if="food.oddsRatio && food.oddsRatio !== 'N/A'" class="text-xs text-slate-500">
                  OR: {{ food.oddsRatio }}
                </span>
                <span v-else-if="food.relativeRisk && food.relativeRisk !== 'N/A'" class="text-xs text-slate-500">
                  RR: {{ food.relativeRisk }}
                </span>
              </div>

              <div class="flex gap-2 p-2.5 bg-slate-50 border-t border-slate-100 sticky bottom-0">
                <BaseButton @click="applySelectedFoods" variant="primary" size="xs" class="px-4 py-1.5 rounded-lg">{{ $t('common.close') }}</BaseButton>
                <BaseButton @click="closeDropdown" variant="secondary" size="xs" class="px-4 py-1.5 rounded-lg border-slate-300">{{ $t('common.cancel') }}</BaseButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
</div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useSuspectedFood } from '../composables/useSuspectedFood';
import BaseButton from '../../Common/BaseButton.vue';

const dropdownRef = ref<HTMLElement | null>(null);

const {
  suspectedFood,
  isDropdownOpen,
  showAnalysisTooltip,
  analysisTooltipRef,
  hasAnalysisResults,
  sortedFoodItems,
  backgroundAnalysisFoods,
  analysisStatus,
  analysisTooltipStyle,
  getAnalysisStatusTooltip,
  toggleDropdown,
  closeDropdown,
  isFoodSelected,
  toggleFoodSelection,
  applySelectedFoods,
  onSuspectedFoodChange
} = useSuspectedFood();

// 드롭다운 외부 클릭 시 자동 저장 후 닫기
const handleClickOutside = (event: MouseEvent) => {
  if (isDropdownOpen.value && dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    applySelectedFoods();
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>
