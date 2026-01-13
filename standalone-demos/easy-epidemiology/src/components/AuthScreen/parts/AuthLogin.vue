<template>
  <div class="animate-fadeUp">
    <form @submit.prevent="handleLogin" novalidate>
      <!-- Portfolio Notice -->
      <div class="mb-8 p-5 bg-slate-50 border border-slate-100 rounded-2xl flex items-start gap-3.5 group hover:bg-slate-100/80 hover:border-slate-200 transition-colors duration-300">
        <div class="p-2 bg-white rounded-xl shadow-sm border border-slate-100 shrink-0">
          <span class="material-icons text-slate-600 text-lg">school</span>
        </div>
        <div class="text-[14px] leading-relaxed text-slate-600 py-0.5">
          <p class="font-bold text-slate-900 mb-0.5">{{ $t('auth.login.demoNoticeTitle') }}</p>
          <p class="text-[13px] text-slate-500">
            <span v-html="$t('auth.login.demoNoticeDesc', { strong: `<strong class='text-slate-800 font-bold underline decoration-slate-300 underline-offset-2'>${$t('auth.login.demoBtn')}</strong>` })"></span>
          </p>
        </div>
      </div>
      <div class="mb-5 transition-all duration-300 ease-in-out group" :class="{ 'has-error': loginErrors.identifier }">
        <label for="login-identifier" class="block text-[13px] font-bold text-slate-700 mb-2 tracking-tight">{{ $t('auth.login.identifierLabel') }}</label>
        <div class="relative">
          <input
            id="login-identifier"
            :value="loginDisplayValue"
            type="text"
            :placeholder="placeholderText"
            required
            :disabled="isLoading"
            @input="handleLoginIdentifierInput"
            @keydown="handleLoginIdentifierKeydown"
            @blur="validateLoginField('identifier')"
            ref="loginIdentifierRef"
            autocomplete="off"
            class="w-full px-4 py-3.5 border border-slate-200 rounded-xl text-[15px] transition-all duration-200 ease-out bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 pr-12"
            :class="{
              'border-blue-500 bg-blue-50 focus:ring-blue-500/10 focus:border-blue-500': currentInputType === 'phone',
              'border-violet-500 bg-violet-50 focus:ring-violet-500/10 focus:border-violet-500': currentInputType === 'email',
              'border-red-500 bg-red-50 focus:ring-red-500/10 focus:border-red-500 shadow-sm shadow-red-500/5': loginErrors.identifier,
              'border-emerald-500 bg-emerald-50 focus:ring-emerald-500/10 focus:border-emerald-500': !loginErrors.identifier && loginData.identifier && !['phone', 'email'].includes(currentInputType), 
              'focus:border-primary-500': currentInputType === 'ambiguous' && !loginErrors.identifier
            }"
          />
          <span v-if="loginErrors.identifier" class="absolute top-1/2 right-4 -translate-y-1/2 text-red-500 z-10 pointer-events-none">
            <span class="material-icons text-xl">error</span>
          </span>
          <span v-else-if="loginData.identifier && !loginErrors.identifier" class="absolute top-1/2 right-4 -translate-y-1/2 text-emerald-500 z-10 pointer-events-none">
            <span class="material-icons text-xl">check_circle</span>
          </span>
        </div>
      </div>
      
      <div class="mb-6">
        <BaseInput
          id="login-password"
          :label="$t('auth.login.passwordLabel')"
          v-model="loginData.password"
          type="password"
          :placeholder="$t('auth.login.passwordLabel')"
          :disabled="isLoading"
          :error="loginErrors.password"
          rounded="lg"
          ref="loginPasswordRef"
          @keydown="handleKeydown"
          @blur="validateLoginField('password')"
        />
      </div>
      
      <div v-if="error" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-[13px] font-bold flex items-center gap-2.5 animate-slideIn shadow-sm shadow-red-500/5" role="alert">
        <span class="material-icons text-lg">warning</span>
        {{ error }}
      </div>
      
      <div class="mt-8">
        <BaseButton
          type="submit"
          variant="primary"
          size="lg"
          block
          class="!py-4 !rounded-2xl !text-[15px] shadow-premium hover:shadow-xl hover:shadow-slate-900/10"
          :loading="isLoading"
          ref="loginSubmitRef"
        >
          <div class="flex items-center justify-center gap-2.5">
            <span class="material-icons text-xl group-hover:translate-x-1 transition-transform" v-if="!isLoading">login</span>
            <span>{{ $t('auth.login.autoLoginBtn') }}</span>
          </div>
        </BaseButton>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';
import BaseInput from '../../Common/BaseInput.vue';
import BaseButton from '../../Common/BaseButton.vue';
import { 
  isValidEmail, 
  isValidPhone, 
  detectInputType, 
  formatPhoneNumber
} from '../logic/inputHandlers';
import { useEmailAutocomplete } from '../logic/useEmailAutocomplete';

interface Props {
  isLoading?: boolean;
  error?: string;
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
  error: ''
});

const emit = defineEmits<{
  (e: 'login', data: { identifier: string; password?: string; identifierType?: string }): void;
  (e: 'update:error', value: string): void;
}>();

// Refs for DOM elements
const { t } = useI18n();
const loginIdentifierRef = ref<HTMLInputElement | null>(null);
const loginPasswordRef = ref<any | null>(null); // BaseInput instance
const loginSubmitRef = ref<any | null>(null);   // BaseButton instance

// Use Composable
const { 
  userInput: emailUserInput, 
  suggestion: emailSuggestion, 
  displayValue: emailDisplayValue, 
  handleInput: handleEmailInput, 
  handleKeydown: handleEmailKeydown,
  reset: resetEmail,
  setValue: setEmailValue
} = useEmailAutocomplete(loginIdentifierRef);

// State
const loginData = ref({ identifier: '', password: '' });
// We use a local simple ref for phone/ambiguous, but for email we sync with composable
const simpleUserInput = ref(''); 
const currentInputType = ref<'phone' | 'email' | 'ambiguous'>('ambiguous'); 
const previousInputType = ref<'phone' | 'email' | 'ambiguous'>('ambiguous');
const identifierType = ref<string>('');
const loginErrors = ref({ identifier: '', password: '' });

// Computed
// If email, use composable's display value. Else use simpleUserInput
const loginDisplayValue = computed(() => {
  if (currentInputType.value === 'email') {
    return emailDisplayValue.value;
  }
  return simpleUserInput.value;
});

const placeholderText = computed(() => {
  switch (currentInputType.value) {
    case 'phone': return t('auth.login.phonePlaceholder');
    case 'email': return t('auth.login.emailPlaceholder');
    default: return t('auth.login.identifierLabel');
  }
});

// Watch
watch(() => loginData.value.password, () => {
  if (loginErrors.value.password) validateLoginField('password');
});

// Sync changes from composable back to loginData if needed
watch(emailDisplayValue, (val) => {
  if (currentInputType.value === 'email') {
    loginData.value.identifier = val;
  }
});

// Mounted
onMounted(() => {
  nextTick(() => {
    loginIdentifierRef.value?.focus();
  });
});

// Methods
function handleKeydown(event: KeyboardEvent) {
  if (props.isLoading) return;
  if (event.key === 'Enter') {
    event.preventDefault();
    const target = event.target as HTMLElement;
    if (target.id === 'login-password') {
      handleLogin();
    }
  }
}

function handleLoginIdentifierKeydown(e: KeyboardEvent) {
  // If we are in email mode, let composable handle magic keys (Tab, etc)
  if (currentInputType.value === 'email') {
    // We still want to intercept Enter to move focus, IF composable didn't consume it
    // Composable intercepts Enter if suggestion exists.
    
    // Check if composable consumes it
    if (emailSuggestion.value && (e.key === 'Tab' || e.key === 'Enter' || e.key === 'ArrowRight')) {
        // Composable logic duplicates check of SelectionStart. 
        // We call it:
        handleEmailKeydown(e);
        // If suggestion was committed, we might want to move focus on Tab
        if (e.key === 'Tab' && !e.defaultPrevented) {
             // If composable didn't prevent default (meaning it didn't use it for completion),
             // then native tab works. 
             // If it did prevent default, it completed the email. 
             // We might want to manually move focus to password?
             setTimeout(() => loginPasswordRef.value?.focus(), 100);
        }
    } else {
        // Normal keys or no suggestion
        handleEmailKeydown(e);
    }
    
    // If Enter was pressed and NOT consumed by suggestion completion (suggestion empty or cursor not at end)
    if (e.key === 'Enter' && !e.defaultPrevented) {
        e.preventDefault();
        loginPasswordRef.value?.focus();
    }
    
    return;
  } else {
    // Normal behavior for non-email
     if (e.key === 'Enter') {
        e.preventDefault();
        loginPasswordRef.value?.focus();
     }
  }
}

function handleLoginIdentifierInput(e: Event) {
  const target = e.target as HTMLInputElement;
  const rawValue = target.value;
  
  // Detect Type
  const detectedType = detectInputType(rawValue);
  
  previousInputType.value = currentInputType.value;
  currentInputType.value = detectedType;
  
  if (detectedType === 'email') {
    // Delegate to composable
    handleEmailInput(e);
    identifierType.value = 'email';
    // loginData updated via watch
  } else if (detectedType === 'phone') {
    // Phone Logic
    const formatted = formatPhoneNumber(rawValue);
    simpleUserInput.value = formatted;
    // Clear email state if switching
    if (previousInputType.value === 'email') resetEmail();
    
    loginData.value.identifier = formatted;
    identifierType.value = 'phone';
    
    // If we formatted it, update the input value visually
    if (formatted !== rawValue) {
        target.value = formatted;
    }
  } else {
    // Ambiguous
    simpleUserInput.value = rawValue;
     if (previousInputType.value === 'email') resetEmail();
     
    loginData.value.identifier = rawValue;
    identifierType.value = '';
  }

  // Validate on input if error exists
  nextTick(() => {
     if (loginErrors.value.identifier) validateLoginField('identifier');
  });
}


function validateLoginField(field: 'identifier' | 'password') {
  if (field === 'identifier') {
    if (!loginData.value.identifier) {
      loginErrors.value.identifier = '이메일 또는 전화번호를 입력해주세요.';
    } else {
      if (currentInputType.value === 'email') {
        if (!isValidEmail(loginData.value.identifier)) loginErrors.value.identifier = '올바른 이메일 형식이 아닙니다.';
        else loginErrors.value.identifier = '';
      } else if (currentInputType.value === 'phone') {
        if (!isValidPhone(loginData.value.identifier)) loginErrors.value.identifier = '올바른 전화번호 형식이 아닙니다.';
        else loginErrors.value.identifier = '';
      } else {
        loginErrors.value.identifier = '';
      }
    }
  } else if (field === 'password') {
    if (!loginData.value.password) loginErrors.value.password = '비밀번호를 입력해주세요.';
    else loginErrors.value.password = '';
  }
}

function handleLogin() {
  if (!loginData.value.identifier) {
    // Demo login logic
    const demoEmail = 'demo@example.com';
    currentInputType.value = 'email';
    setEmailValue(demoEmail);
    loginData.value.identifier = demoEmail;
    identifierType.value = 'email';
  }
  
  if (!loginData.value.password) {
    loginData.value.password = 'demo1234';
  }

  if (loginData.value.identifier === 'demo@example.com' && loginData.value.password === 'demo1234') {
    loginErrors.value.identifier = '';
    loginErrors.value.password = '';
  } else {
    validateLoginField('identifier');
    validateLoginField('password');
    
    if (loginErrors.value.identifier || loginErrors.value.password) return;
  }
  
  emit('login', {
    identifier: loginData.value.identifier,
    password: loginData.value.password,
    identifierType: identifierType.value
  });
}
</script>


