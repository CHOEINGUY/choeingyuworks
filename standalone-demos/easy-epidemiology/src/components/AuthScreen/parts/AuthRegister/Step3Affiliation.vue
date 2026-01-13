<template>
  <div class="animate-in fade-in slide-in-from-right-3 duration-300">
    <StepIndicator :current-step="3" :total-steps="3" />
    <h3 class="text-center text-xl font-bold text-slate-900 mb-7 tracking-tight">{{ $t('auth.register.steps.affiliation') }}</h3>
    
    <form @submit.prevent="handleSubmit" class="space-y-5">
      <!-- 소속 유형 -->
      <div class="group">
        <label for="register-affiliation-type" class="block text-[13px] font-semibold text-slate-700 mb-2 tracking-tight">{{ $t('auth.register.labels.affiliationType') }}</label>
        <div class="relative">
          <select
            id="register-affiliation-type"
            v-model="formData.affiliationType"
            required
            :disabled="isLoading"
            @blur="validateField('affiliationType')"
            ref="affiliationTypeInputRef"
            class="w-full px-4 py-3.5 bg-slate-50 border rounded-xl text-[15px] transition-all duration-200 focus:outline-none focus:ring-4 disabled:opacity-50 appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg_xmlns=\'http://www.w3.org/2000/svg\'_viewBox=\'0_0_24_24\'_fill=\'none\'_stroke=\'%2364748b\'_stroke-width=\'2\'_stroke-linecap=\'round\'_stroke-linejoin=\'round\'%3e%3cpolyline_points=\'6,9_12,15_18,9\'%3e%3c/polyline%3e%3c/svg%3e')] bg-no-repeat bg-[right_14px_center] bg-[length:16px] pr-11"
            :class="[
              errors.affiliationType ? 'border-red-500 bg-red-50 focus:ring-red-500/10' : 
              (formData.affiliationType && !errors.affiliationType ? 'border-emerald-500 bg-emerald-50 focus:ring-emerald-500/10' : 'border-slate-200 focus:border-slate-900 focus:bg-white focus:ring-slate-900/5')
            ]"
          >
            <option value="">{{ $t('auth.register.placeholders.affiliationType') }}</option>
            <option value="hospital">{{ $t('auth.register.affiliationTypes.hospital') }}</option>
            <option value="clinic">{{ $t('auth.register.affiliationTypes.clinic') }}</option>
            <option value="public_health">{{ $t('auth.register.affiliationTypes.public_health') }}</option>
            <option value="university">{{ $t('auth.register.affiliationTypes.university') }}</option>
            <option value="research">{{ $t('auth.register.affiliationTypes.research') }}</option>
            <option value="government">{{ $t('auth.register.affiliationTypes.government') }}</option>
            <option value="other">{{ $t('auth.register.affiliationTypes.other') }}</option>
          </select>
          <span v-if="errors.affiliationType" class="absolute right-11 top-1/2 -translate-y-1/2 text-red-500 flex items-center z-10">
            <span class="material-icons text-xl">error</span>
          </span>
          <span v-else-if="formData.affiliationType && !errors.affiliationType" class="absolute right-11 top-1/2 -translate-y-1/2 text-emerald-500 flex items-center z-10">
            <span class="material-icons text-xl">check_circle</span>
          </span>
        </div>
        <small v-if="errors.affiliationType" class="block mt-1.5 text-xs font-medium text-red-500">{{ errors.affiliationType }}</small>
      </div>
      
      <!-- 소속명 -->
      <div class="group">
        <label for="register-affiliation" class="block text-[13px] font-semibold text-slate-700 mb-2 tracking-tight">{{ $t('auth.register.labels.affiliation') }}</label>
        <div class="relative">
          <input
            id="register-affiliation"
            v-model="formData.affiliation"
            type="text"
            :placeholder="$t('auth.register.placeholders.affiliation')"
            required
            :disabled="isLoading"
            @blur="validateField('affiliation')"
            ref="affiliationInputRef"
            class="w-full px-4 py-3.5 bg-slate-50 border rounded-xl text-[15px] transition-all duration-200 focus:outline-none focus:ring-4 disabled:opacity-50"
            :class="[
              errors.affiliation ? 'border-red-500 bg-red-50 focus:ring-red-500/10' : 
              (formData.affiliation && !errors.affiliation ? 'border-emerald-500 bg-emerald-50 focus:ring-emerald-500/10' : 'border-slate-200 focus:border-slate-900 focus:bg-white focus:ring-slate-900/5')
            ]"
          />
          <span v-if="errors.affiliation" class="absolute right-3.5 top-1/2 -translate-y-1/2 text-red-500 flex items-center z-10">
            <span class="material-icons text-xl">error</span>
          </span>
          <span v-else-if="formData.affiliation && !errors.affiliation" class="absolute right-3.5 top-1/2 -translate-y-1/2 text-emerald-500 flex items-center z-10">
            <span class="material-icons text-xl">check_circle</span>
          </span>
        </div>
        <small v-if="errors.affiliation" class="block mt-1.5 text-xs font-medium text-red-500">{{ errors.affiliation }}</small>
      </div>
      
      <div v-if="error" class="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100 flex items-center gap-2.5" role="alert">
        <span class="material-icons text-lg">warning</span>
        {{ error }}
      </div>
      
      <div class="flex gap-3 pt-2">
        <button 
          type="button" 
          class="flex-1 py-4 px-6 bg-white text-slate-600 font-bold rounded-xl text-[15px] border border-slate-200 transition-all duration-200 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50"
          @click="$emit('prev')"
          :disabled="isLoading"
        >
          {{ $t('auth.register.buttons.prev') }}
        </button>
        <button 
          type="submit" 
          class="flex-[2] py-4 bg-slate-900 text-white font-bold rounded-xl text-[15px] shadow-lg shadow-slate-900/10 transition-all duration-200 hover:bg-slate-800 hover:-translate-y-0.5 active:translate-y-0 disabled:bg-slate-300 disabled:text-slate-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
          :disabled="isLoading || !formData.affiliationType || !formData.affiliation"
        >
          <span v-if="isLoading" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          <span v-if="isLoading">{{ $t('auth.register.buttons.completing') }}</span>
          <template v-else>
            <span class="material-icons text-lg">check</span>
            <span>{{ $t('auth.register.buttons.complete') }}</span>
          </template>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';
import StepIndicator from './StepIndicator.vue';

interface Props {
  isLoading?: boolean;
  error?: string;
  initialData?: any;
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
  error: '',
  initialData: () => ({})
});

const emit = defineEmits<{
  (e: 'submit', data: any): void;
  (e: 'prev'): void;
  (e: 'update:data', value: any): void;
}>();

const { t } = useI18n();

// Refs
const affiliationTypeInputRef = ref<HTMLSelectElement | null>(null);
const affiliationInputRef = ref<HTMLInputElement | null>(null);

// State
const formData = ref({
  affiliationType: props.initialData.affiliationType || '',
  affiliation: props.initialData.affiliation || ''
});
const errors = ref({ affiliationType: '', affiliation: '' });

// Watch
watch(formData, (val) => {
  emit('update:data', val);
}, { deep: true });

watch(() => formData.value.affiliation, () => {
  if (errors.value.affiliation) validateField('affiliation');
});

watch(() => formData.value.affiliationType, () => {
  if (errors.value.affiliationType) validateField('affiliationType');
});

// Mounted
onMounted(() => {
  nextTick(() => affiliationTypeInputRef.value?.focus());
});

// Methods
function validateField(field: 'affiliationType' | 'affiliation') {
  if (field === 'affiliationType') {
    if (!formData.value.affiliationType) errors.value.affiliationType = t('auth.register.errors.affiliationTypeRequired');
    else errors.value.affiliationType = '';
  } else if (field === 'affiliation') {
    if (!formData.value.affiliation) errors.value.affiliation = t('auth.register.errors.affiliationRequired');
    else errors.value.affiliation = '';
  }
}

function handleSubmit() {
  validateField('affiliationType');
  validateField('affiliation');
  
  if (errors.value.affiliationType || errors.value.affiliation) return;
  
  emit('submit', formData.value);
}
</script>

<style scoped>
/* All styles handled via Tailwind */
</style>
