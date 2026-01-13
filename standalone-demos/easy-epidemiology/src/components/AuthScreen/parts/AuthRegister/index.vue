<template>
  <div class="animate-fadeUp [animation-delay:0.4s] [animation-fill-mode:backwards]">
    <transition 
      enter-active-class="transition-all duration-300 ease-out"
      leave-active-class="transition-all duration-300 ease-in"
      enter-from-class="opacity-0 translate-x-5"
      leave-to-class="opacity-0 -translate-x-5"
      mode="out-in"
    >
      <!-- Step 1: Basic Info -->
      <Step1BasicInfo
        v-if="currentStep === 1"
        key="step1"
        :is-loading="isChecking"
        :initial-data="formData"
        @next="handleStep1Next"
        @update:data="updateFormData"
        ref="step1Ref"
      />
      
      <!-- Step 2: Password -->
      <Step2Password
        v-else-if="currentStep === 2"
        key="step2"
        :is-loading="isLoading"
        :initial-data="formData"
        @next="handleStep2Next"
        @prev="currentStep = 1"
        @update:data="updateFormData"
      />
      
      <!-- Step 3: Affiliation -->
      <Step3Affiliation
        v-else-if="currentStep === 3"
        key="step3"
        :is-loading="isLoading"
        :error="error"
        :initial-data="formData"
        @submit="handleSubmit"
        @prev="currentStep = 2"
        @update:data="updateFormData"
      />
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '../../../../stores/authStore';
import { authApi } from '../../../../services/authApi';
import Step1BasicInfo from './Step1BasicInfo.vue';
import Step2Password from './Step2Password.vue';
import Step3Affiliation from './Step3Affiliation.vue';

interface Props {
  isLoading?: boolean;
  error?: string;
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
  error: ''
});

const emit = defineEmits<{
  (e: 'register', data: any): void;
  (e: 'update:error', value: string): void;
}>();

const { t } = useI18n();
const authStore = useAuthStore();
const step1Ref = ref<any>(null);

// State
const currentStep = ref(1);
const isChecking = ref(false);
const formData = ref({
  name: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  affiliationType: '',
  affiliation: ''
});

// Watch
watch(() => authStore.isAuthenticated, (newValue, oldValue) => {
  if (oldValue === true && newValue === false) {
    resetForm();
  }
});

// Methods
function updateFormData(data: Partial<typeof formData.value>) {
  formData.value = { ...formData.value, ...data };
}

async function handleStep1Next(data: any) {
  updateFormData(data);
  isChecking.value = true;
  emit('update:error', '');
  
  try {
    // Check Email availability
    try {
      const emailCheck = await authApi.checkEmailAvailability(formData.value.email);
      if (emailCheck.available === false) {
        step1Ref.value?.setError('email', t('auth.register.errors.emailExists'));
        isChecking.value = false;
        return;
      }
    } catch (e) {
      step1Ref.value?.setError('local', t('auth.register.errors.emailCheckError'));
      isChecking.value = false;
      return;
    }
    
    // Check Phone availability
    try {
      const cleanPhone = formData.value.phone.replace(/[^0-9]/g, '');
      const phoneCheck = await authApi.checkPhoneAvailability(cleanPhone);
      if (phoneCheck.available === false) {
        step1Ref.value?.setError('phone', t('auth.register.errors.phoneExists'));
        isChecking.value = false;
        return;
      }
    } catch (e) {
      step1Ref.value?.setError('local', t('auth.register.errors.phoneCheckError'));
      isChecking.value = false;
      return;
    }
    
    currentStep.value = 2;
  } catch (err) {
    step1Ref.value?.setError('local', t('auth.register.errors.checkError'));
  } finally {
    isChecking.value = false;
  }
}

function handleStep2Next(data: any) {
  updateFormData(data);
  currentStep.value = 3;
}

function handleSubmit(data: any) {
  updateFormData(data);
  emit('register', formData.value);
}

function resetForm() {
  currentStep.value = 1;
  formData.value = {
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    affiliationType: '',
    affiliation: ''
  };
}
</script>

<style scoped>
/* Scoped styles replaced by Tailwind utilities */
</style>
