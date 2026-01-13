<template>
  <div class="animate-in fade-in slide-in-from-right-3 duration-300">
    <StepIndicator :current-step="2" :total-steps="3" />
    <h3 class="text-center text-xl font-bold text-slate-900 mb-7 tracking-tight">{{ $t('auth.register.steps.password') }}</h3>
    
    <form @submit.prevent="handleSubmit" class="space-y-5">
      <!-- 비밀번호 -->
      <div class="group/field">
        <label for="register-password" class="block text-[13px] font-bold text-slate-700 mb-2 tracking-tight px-0.5">{{ $t('auth.register.labels.password') }}</label>
        <div class="relative">
          <input
            id="register-password"
            v-model="formData.password"
            :type="showPassword ? 'text' : 'password'"
            :placeholder="$t('auth.register.placeholders.password')"
            required
            :disabled="isLoading"
            @blur="validateField('password')"
            ref="passwordInputRef"
            class="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-[15px] transition-all duration-300 focus:outline-none focus:ring-4 focus:bg-white pr-20"
            :class="[
              errors.password ? 'border-red-500 focus:ring-red-500/10' : 
              (formData.password && !errors.password ? 'border-emerald-500 focus:ring-emerald-500/10' : 'focus:border-primary-500 focus:ring-primary-500/10')
            ]"
          />
          <div class="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-1 pr-1.5">
            <button
              type="button"
              class="p-1.5 text-slate-400 hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-all duration-200 active:scale-90"
              @click="showPassword = !showPassword"
              tabindex="0"
              :title="$t('auth.register.labels.passwordVisibility')"
            >
              <span class="material-icons text-xl">
                {{ showPassword ? 'visibility' : 'visibility_off' }}
              </span>
            </button>
            <span v-if="errors.password" class="text-red-500 flex items-center pointer-events-none">
              <span class="material-icons text-xl">error</span>
            </span>
            <span v-else-if="formData.password && !errors.password" class="text-emerald-500 flex items-center pointer-events-none">
              <span class="material-icons text-xl">check_circle</span>
            </span>
          </div>
        </div>
        <div class="h-6 mt-1">
          <small v-if="errors.password" class="block text-xs font-bold text-red-500 px-1 animate-slideIn">{{ errors.password }}</small>
        </div>
      </div>
      
      <!-- 비밀번호 확인 -->
      <div class="group/field">
        <label for="register-confirm-password" class="block text-[13px] font-bold text-slate-700 mb-2 tracking-tight px-0.5">{{ $t('auth.register.labels.confirmPassword') }}</label>
        <div class="relative">
          <input
            id="register-confirm-password"
            v-model="formData.confirmPassword"
            :type="showConfirmPassword ? 'text' : 'password'"
            :placeholder="$t('auth.register.placeholders.confirmPassword')"
            required
            :disabled="isLoading"
            @blur="validateField('confirmPassword')"
            ref="confirmPasswordInputRef"
            class="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-[15px] transition-all duration-300 focus:outline-none focus:ring-4 focus:bg-white pr-20"
            :class="[
              errors.confirmPassword ? 'border-red-500 focus:ring-red-500/10' : 
              (formData.confirmPassword && !errors.confirmPassword ? 'border-emerald-500 focus:ring-emerald-500/10' : 'focus:border-primary-500 focus:ring-primary-500/10')
            ]"
          />
          <div class="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-1 pr-1.5">
            <button
              type="button"
              class="p-1.5 text-slate-400 hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-all duration-200 active:scale-90"
              @click="showConfirmPassword = !showConfirmPassword"
              tabindex="0"
              :title="$t('auth.register.labels.passwordVisibility')"
            >
              <span class="material-icons text-xl">
                {{ showConfirmPassword ? 'visibility' : 'visibility_off' }}
              </span>
            </button>
            <span v-if="errors.confirmPassword" class="text-red-500 flex items-center pointer-events-none">
              <span class="material-icons text-xl">error</span>
            </span>
            <span v-else-if="formData.confirmPassword && !errors.confirmPassword" class="text-emerald-500 flex items-center pointer-events-none">
              <span class="material-icons text-xl">check_circle</span>
            </span>
          </div>
        </div>
        <div class="h-6 mt-1">
          <small v-if="errors.confirmPassword" class="block text-xs font-bold text-red-500 px-1 animate-slideIn">{{ errors.confirmPassword }}</small>
        </div>
      </div>
      
      <div class="flex gap-4 pt-4">
        <button 
          type="button" 
          class="flex-1 py-4 px-6 bg-white text-slate-500 font-bold rounded-2xl text-[15px] border border-slate-200 transition-all duration-300 hover:bg-slate-50 hover:text-slate-700 hover:border-slate-300 active:scale-[0.98] disabled:opacity-50"
          @click="$emit('prev')"
          :disabled="isLoading"
        >
          {{ $t('auth.register.buttons.prev') }}
        </button>
        <button 
          type="submit" 
          class="flex-[2] py-4 bg-gradient-to-br from-slate-900 to-slate-800 text-white font-bold rounded-2xl text-[15px] shadow-premium transition-all duration-300 hover:bg-slate-800 hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 active:scale-[0.98] disabled:from-slate-200 disabled:to-slate-200 disabled:text-slate-400 disabled:shadow-none disabled:cursor-not-allowed flex items-center justify-center gap-2 group relative overflow-hidden"
          :disabled="isLoading || !formData.password || !formData.confirmPassword"
        >
          <span class="relative z-10">{{ $t('auth.register.buttons.next') }}</span>
          <span class="material-icons text-xl relative z-10 transition-transform duration-300 group-hover:translate-x-1">arrow_forward</span>
          <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none"></div>
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
  initialData?: any;
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
  initialData: () => ({})
});

const emit = defineEmits<{
  (e: 'next', data: any): void;
  (e: 'prev'): void;
  (e: 'update:data', value: any): void;
}>();

const { t } = useI18n();

// Refs
const passwordInputRef = ref<HTMLInputElement | null>(null);
const confirmPasswordInputRef = ref<HTMLInputElement | null>(null);

// State
const formData = ref({
  password: props.initialData.password || '',
  confirmPassword: props.initialData.confirmPassword || ''
});
const errors = ref({ password: '', confirmPassword: '' });
const showPassword = ref(false);
const showConfirmPassword = ref(false);

// Watch
watch(formData, (val) => {
  emit('update:data', val);
}, { deep: true });

watch(() => formData.value.password, () => {
  if (errors.value.password) validateField('password');
  if (errors.value.confirmPassword) validateField('confirmPassword');
});

watch(() => formData.value.confirmPassword, () => {
  if (errors.value.confirmPassword) validateField('confirmPassword');
});

// Mounted
onMounted(() => {
  nextTick(() => passwordInputRef.value?.focus());
});

// Methods
function validateField(field: 'password' | 'confirmPassword') {
  if (field === 'password') {
    if (!formData.value.password) errors.value.password = t('auth.register.errors.passwordRequired');
    else if (formData.value.password.length < 6) errors.value.password = t('auth.register.errors.passwordTooShort');
    else errors.value.password = '';
  } else if (field === 'confirmPassword') {
    if (!formData.value.confirmPassword) errors.value.confirmPassword = t('auth.register.errors.confirmPasswordRequired');
    else if (formData.value.password !== formData.value.confirmPassword) errors.value.confirmPassword = t('auth.register.errors.passwordMismatch');
    else errors.value.confirmPassword = '';
  }
}

function handleSubmit() {
  validateField('password');
  validateField('confirmPassword');
  
  if (errors.value.password || errors.value.confirmPassword) return;
  
  emit('next', formData.value);
}
</script>

<style scoped>
/* All styles handled via Tailwind */
</style>
