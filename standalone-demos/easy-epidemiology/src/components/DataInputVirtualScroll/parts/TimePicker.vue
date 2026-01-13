<template>
  <div class="w-[210px] p-5 flex flex-col justify-between shrink-0 font-['Noto_Sans_KR',_sans-serif]">
    <div class="font-semibold mb-4 text-[#333]">
      <span>{{ $t('dataInput.datetime.selectTime') }}</span>
    </div>
    
    <div class="flex-1">
      <div class="flex items-center justify-center gap-2 mb-5">
        <div class="flex flex-col items-center gap-1">
          <label for="hour-select" class="text-xs text-gray-500 font-medium">{{ $t('dataInput.datetime.hour') }}</label>
          <select 
            id="hour-select"
            :value="hour"
            @change="handleHourChange"
            class="px-1.5 py-2 border border-gray-200 rounded-md text-sm bg-white cursor-pointer w-[60px] focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
            :aria-label="$t('dataInput.datetime.selectTime')"
            @click.stop
          >
            <option v-for="h in 24" :key="h-1" :value="String(h-1).padStart(2, '0')">
              {{ String(h-1).padStart(2, '0') }}
            </option>
          </select>
        </div>
        
        <div class="text-lg font-semibold text-[#333] mt-4">:</div>
        
        <div class="flex flex-col items-center gap-1">
          <label for="minute-select" class="text-xs text-gray-500 font-medium">{{ $t('dataInput.datetime.minute') }}</label>
          <select 
            id="minute-select"
            :value="minute"
            @change="handleMinuteChange"
            class="px-1.5 py-2 border border-gray-200 rounded-md text-sm bg-white cursor-pointer w-[60px] focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
            :aria-label="$t('dataInput.datetime.minute')"
            @click.stop
          >
            <option v-for="m in 12" :key="m-1" :value="String((m-1) * 5).padStart(2, '0')">
              {{ String((m-1) * 5).padStart(2, '0') }}
            </option>
          </select>
        </div>
      </div>
      
      <!-- 직접 입력 필드 -->
      <div class="hidden">
        <div class="font-semibold mb-2 text-[#333] text-sm">
          <span>{{ $t('dataInput.datetime.manualInput') }}</span>
        </div>
        <div class="mb-3">
          <input
            ref="directInputRef"
            v-model="directInputValue"
            type="text"
            class="w-full px-3 py-2 border border-gray-200 rounded-md text-sm bg-white transition-all focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 hover:border-blue-600 placeholder-gray-400"
            placeholder="YYYY-MM-DD HH:MM"
            @keydown="handleDirectInputKeydown"
            @input="handleDirectInput"
            @blur="handleDirectInputBlur"
            @focus="handleDirectInputFocus"
            @click.stop
          />
        </div>
      </div>
    </div>
    
    <div class="flex flex-col gap-3">
      <div class="flex items-center justify-center">
        <div class="bg-gray-50 px-2 py-3 rounded-lg text-[15px] font-['Noto_Sans_KR',_sans-serif] text-gray-600 border border-gray-200 w-full text-center">
          {{ formatCurrentSelection() }}
        </div>
      </div>
      
      <div class="flex gap-2">
        <button @click.stop="$emit('cancel')" class="flex-1 py-2.5 px-4 border-none rounded-lg cursor-pointer text-sm font-medium transition-all bg-gray-100 text-[#333] hover:bg-gray-200">{{ $t('common.cancel') }}</button>
        <button @click.stop="confirm" class="flex-1 py-2.5 px-4 border-none rounded-lg cursor-pointer text-sm font-medium transition-all bg-blue-600 text-white hover:bg-blue-700">{{ $t('common.confirm') }}</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { showToast } from '../logic/toast';

const { t } = useI18n();

const props = defineProps<{
  year: number;
  month: number;
  day: number;
  hour: string;
  minute: string;
}>();

const emit = defineEmits<{
  (e: 'update:year', value: number): void;
  (e: 'update:month', value: number): void;
  (e: 'update:day', value: number): void;
  (e: 'update:hour', value: string): void;
  (e: 'update:minute', value: string): void;
  (e: 'confirm'): void;
  (e: 'cancel'): void;
}>();

const directInputRef = ref<HTMLInputElement | null>(null);
const directInputValue = ref('');

// 현재 선택 상태 포맷
const formatCurrentSelection = () => {
  if (!props.year || !props.month || !props.day) {
    return t('dataInput.datetime.selectDate');
  }
  
  const formattedYear = props.year;
  const formattedMonth = String(props.month).padStart(2, '0');
  const formattedDay = String(props.day).padStart(2, '0');
  
  return `${formattedYear}-${formattedMonth}-${formattedDay} ${props.hour}:${props.minute}`;
};

// 시간 변경 처리
const handleHourChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  emit('update:hour', target.value);
};

// 분 변경 처리
const handleMinuteChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  emit('update:minute', target.value);
};

// 확인 버튼
const confirm = () => {
  if (!props.year || !props.month || !props.day) {
    showToast(t('dataInput.datetime.alertSelectDate'), 'warning');
    return;
  }
  emit('confirm');
};

// 직접 입력 처리
const handleDirectInput = () => {
  const value = directInputValue.value;
  if (!value) return;
  
  // YYYY-MM-DD HH:MM 형식 파싱
  const regex = /^(\d{4})-(\d{1,2})-(\d{1,2})\s+(\d{1,2}):(\d{1,2})$/;
  const match = value.match(regex);
  
  if (match) {
    const [, year, month, day, hour, minute] = match;
    const yearNum = parseInt(year);
    const monthNum = parseInt(month);
    const dayNum = parseInt(day);
    const hourNum = parseInt(hour);
    const minuteNum = parseInt(minute);
    
    // 유효한 날짜인지 확인
    const date = new Date(yearNum, monthNum - 1, dayNum);
    if (date.getFullYear() === yearNum && 
        date.getMonth() === monthNum - 1 && 
        date.getDate() === dayNum &&
        hourNum >= 0 && hourNum <= 23 &&
        minuteNum >= 0 && minuteNum <= 59) {
      
      // 선택된 날짜와 시간 업데이트
      emit('update:year', yearNum);
      emit('update:month', monthNum);
      emit('update:day', dayNum);
      emit('update:hour', String(hourNum).padStart(2, '0'));
      emit('update:minute', String(minuteNum).padStart(2, '0'));
    }
  }
};

// 직접 입력 키보드 처리
const handleDirectInputKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    handleDirectInput();
    confirm();
  } else if (event.key === 'Escape') {
    event.preventDefault();
    emit('cancel');
  } else if (event.key === 'Tab') {
    // Tab 키는 기본 동작 허용 (다음 요소로 이동)
    return;
  }
  // 다른 키는 기본 동작 허용 (타이핑 가능)
};

// 직접 입력 포커스 아웃 처리
const handleDirectInputBlur = () => {
  // 약간의 지연 후 처리 (다른 요소로 포커스 이동 시)
  setTimeout(() => {
    handleDirectInput();
  }, 150);
};

// 직접 입력 포커스 인 처리
const handleDirectInputFocus = () => {
  // 포커스 인 시 직접 입력 필드 업데이트
  directInputValue.value = formatCurrentSelection();
};

// 선택된 날짜나 시간이 변경될 때 직접 입력 필드 업데이트
watch(
  () => [props.year, props.month, props.day, props.hour, props.minute],
  () => {
    // 입력 필드에 포커스가 없을 때만 업데이트하여 입력 중 방해 방지
    if (document.activeElement !== directInputRef.value) {
      directInputValue.value = formatCurrentSelection();
    }
  },
  { deep: true, immediate: true }
);
</script>

<style scoped>
/* No styles needed, using Tailwind classes */
</style>
