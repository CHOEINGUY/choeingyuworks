<template>
  <div 
    v-if="visible" 
    class="fixed z-[9999] bg-white border border-gray-200 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] font-['Noto_Sans_KR',_sans-serif] outline-none select-none"
    :style="pickerStyle"
    @click.stop
    @mousedown.stop
    @mouseup.stop
    @keydown="handleKeyDown"
    tabindex="0"
    ref="pickerRef"
    role="dialog"
    aria-model="true"
    :aria-label="$t('dataInput.datetime.selectDateTime')"
  >
    <div class="flex min-w-[480px] max-w-[600px]">
      <!-- 캘린더 부분 -->
      <CalendarPicker
        ref="calendarPickerRef"
        :year="selectedDate.year"
        :month="selectedDate.month"
        :day="selectedDate.day"
        @update:year="updateYear"
        @update:month="updateMonth"
        @update:day="updateDay"
        @select="onDateSelected"
      />
      
      <!-- 시간 선택 부분 -->
      <TimePicker
        v-model:year="selectedDate.year as number"
        v-model:month="selectedDate.month as number"
        v-model:day="selectedDate.day as number"
        v-model:hour="selectedHour"
        v-model:minute="selectedMinute"
        @confirm="confirm"
        @cancel="cancel"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';
import CalendarPicker from './CalendarPicker.vue';
import TimePicker from './TimePicker.vue';
import { showToast } from '../logic/toast';

import type { DateInfo } from '@/types/virtualGridContext';


const { t } = useI18n();

const props = defineProps<{
  visible: boolean;
  position: { top: number; left: number };
  initialValue: DateInfo | null;
}>();

const emit = defineEmits<{
  (e: 'confirm', result: DateInfo): void;
  (e: 'cancel'): void;
  (e: 'update:visible', visible: boolean): void;
}>();

const pickerRef = ref<HTMLElement | null>(null);
const calendarPickerRef = ref<any>(null);

// 현재 선택된 날짜와 시간
const selectedDate = reactive({
  year: null as number | null,
  month: null as number | null,
  day: null as number | null
});

const selectedHour = ref('00');
const selectedMinute = ref('00');

// 피커 스타일 (수정된 위치 반영)
const adjustedPosition = ref({ top: 0, left: 0 });
const pickerStyle = computed(() => ({
  top: `${adjustedPosition.value.top}px`,
  left: `${adjustedPosition.value.left}px`
}));

// Update Handlers
const updateYear = (val: number) => { selectedDate.year = val; };
const updateMonth = (val: number) => { selectedDate.month = val; };
const updateDay = (val: number) => { selectedDate.day = val; };

// Date Selected Handler
const onDateSelected = () => {
  nextTick(() => {
    const cellElement = document.querySelector(`[data-row="${props.initialValue?.rowIndex}"][data-col="${props.initialValue?.colIndex}"]`);
    if (cellElement instanceof HTMLElement) {
      cellElement.focus();
    }
  });
};

// 확인 버튼
const confirm = () => {
  if (!selectedDate.year || !selectedDate.month || !selectedDate.day) {
    showToast(t('dataInput.datetime.alertSelectDate'), 'warning');
    return;
  }
  
  const result: DateInfo = {
    year: selectedDate.year,
    month: selectedDate.month,
    day: selectedDate.day,
    hour: selectedHour.value,
    minute: selectedMinute.value
  };
  
  emit('confirm', result);
};

// 취소 버튼
const cancel = () => {
  emit('cancel');
};

// 키보드 이벤트 처리
const handleKeyDown = (event: KeyboardEvent) => {
  // 글로벌 단축키
  if (event.key === 'Escape') {
    event.preventDefault();
    event.stopPropagation();
    cancel();
    return;
  }
  
  if (event.key === 'Enter') {
    event.preventDefault();
    event.stopPropagation();
    confirm();
    return;
  }

  // 입력 필드나 선택 박스에 포커스가 있을 때는 캘린더 네비게이션을 하지 않음
  const activeTag = document.activeElement ? document.activeElement.tagName : '';
  if (['INPUT', 'SELECT', 'TEXTAREA'].includes(activeTag)) {
    return;
  }

  // 그 외 키는 CalendarPicker로 위임
  if (calendarPickerRef.value) {
    calendarPickerRef.value.handleKeyDown(event);
  }
};

// 초기값 설정
watch(() => props.initialValue, (newValue) => {
  if (newValue) {
    selectedDate.year = newValue.year;
    selectedDate.month = newValue.month;
    selectedDate.day = newValue.day;
    selectedHour.value = String(newValue.hour || '00');
    // 분을 5분 단위로 반올림 (TimePicker 로직에 맞춤, 필요시 TimePicker 내부로 이동 가능)
    const minuteValue = String(newValue.minute || '00');
    const minuteNum = parseInt(minuteValue);
    selectedMinute.value = String(minuteNum).padStart(2, '0');
  } else {
    // 초기값이 없으면 현재 날짜/시간으로 설정
    const now = new Date();
    selectedDate.year = now.getFullYear();
    selectedDate.month = now.getMonth() + 1;
    selectedDate.day = now.getDate();
    selectedHour.value = String(now.getHours()).padStart(2, '0');
    selectedMinute.value = String(now.getMinutes()).padStart(2, '0');
  }
}, { immediate: true });

// 피커 위치 조정 함수
const updatePosition = () => {
  if (!pickerRef.value) return;

  // 초기 위치 설정 (부모에서 전달받은 위치)
  const currentTop = props.position.top;
  const currentLeft = props.position.left;
  
  // 피커 높이 측정
  const pickerRect = pickerRef.value.getBoundingClientRect();
  const pickerHeight = pickerRect.height;
  const viewportHeight = window.innerHeight;
  const viewportWidth = window.innerWidth;

  // 하단 여유 공간 확인 (10px 여유)
  const spaceBelow = viewportHeight - currentTop;
  const hasSpaceBelow = spaceBelow >= pickerHeight + 10;

  // 기본 위치
  let newTop = currentTop;
  let newLeft = currentLeft;

  // 하단 공간 부족 시 위쪽으로 표시
  if (!hasSpaceBelow) {
    // 셀 엘리먼트 찾기 (입력창 바로 위에 표시하기 위함)
    if (props.initialValue) {
      const cellSelector = `[data-row="${props.initialValue.rowIndex}"][data-col="${props.initialValue.colIndex}"]`;
      const cellElement = document.querySelector(cellSelector);
      
      if (cellElement) {
        const cellRect = cellElement.getBoundingClientRect();
        // 셀의 위쪽 - 피커 높이
        newTop = cellRect.top - pickerHeight;
      } else {
        // 셀을 못 찾으면 대략적인 높이(40px) 가정하고 위로 올림
        newTop = currentTop - pickerHeight - 40;
      }
    } else {
       newTop = currentTop - pickerHeight - 40;
    }
    
    // 위쪽으로 보냈는데 위쪽도 잘리면? -> 그래도 화면 안에는 들어오게 조정
    if (newTop < 10) newTop = 10;
  }

  // 우측 화면 밖으로 나가는 경우 조정
  if (newLeft + pickerRect.width > viewportWidth) {
    newLeft = viewportWidth - pickerRect.width - 20;
  }
  
  // 최종 위치 적용
  adjustedPosition.value = { top: newTop, left: newLeft };
};

// 피커가 보여질 때 위치 재조정
watch(() => props.visible, (visible) => {
  if (visible) {
    // 일단 초기 위치로 설정
    adjustedPosition.value = { ...props.position };
    
    nextTick(() => {
      // 렌더링 후 실제 크기 기반으로 위치 조정
      updatePosition();
      
      // 스크롤 방지
      preventScroll();
      
      // 외부 클릭 감지 이벤트 리스너 추가
      setTimeout(() => {
        document.addEventListener('click', handleOutsideClick);
      }, 0);
    });
  } else {
    // 스크롤 방지 해제
    restoreScroll();
    
    // 외부 클릭 감지 이벤트 리스너 제거
    document.removeEventListener('click', handleOutsideClick);
  }
});

// 스크롤 방지 관련 변수
let scrollPrevented = false;
let originalOverflow = '';

// 스크롤 방지 함수
const preventScroll = () => {
  if (scrollPrevented) return;
  
  scrollPrevented = true;
  originalOverflow = document.body.style.overflow;
  document.body.style.overflow = 'hidden';
  
  // 휠 이벤트 방지
  const preventWheel = (e: WheelEvent | TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  document.addEventListener('wheel', preventWheel as EventListener, { passive: false });
  document.addEventListener('touchmove', preventWheel as EventListener, { passive: false });
  
  // @ts-ignore
  document._preventWheel = preventWheel;
};

// 스크롤 방지 해제 함수
const restoreScroll = () => {
  if (!scrollPrevented) return;
  
  scrollPrevented = false;
  document.body.style.overflow = originalOverflow;
  
  // 휠 이벤트 리스너 제거
  // @ts-ignore
  if (document._preventWheel) {
    // @ts-ignore
    document.removeEventListener('wheel', document._preventWheel as EventListener, { passive: false });
    // @ts-ignore
    document.removeEventListener('touchmove', document._preventWheel as EventListener, { passive: false });
    // @ts-ignore
    delete document._preventWheel;
  }
};

// 외부 클릭 감지 함수
const handleOutsideClick = (event: MouseEvent) => {
  if (!props.visible) return;
  
  // 데이트피커 요소인지 확인
  const pickerElement = pickerRef.value;
  if (pickerElement) {
    // 클릭된 요소가 데이트피커 내부인지 확인
    let isInsidePicker = false;
    let currentElement = event.target as HTMLElement | null;
    
    // DOM 트리를 올라가면서 데이트피커 요소를 찾음
    while (currentElement && currentElement !== document.body) {
      if (currentElement === pickerElement) {
        isInsidePicker = true;
        break;
      }
      currentElement = currentElement.parentElement;
    }
    
    // 데이트피커 외부 클릭이면 닫기
    if (!isInsidePicker) {
      console.log('외부 클릭으로 데이트피커 닫기');
      cancel();
    }
  }
};

defineExpose({ confirm, cancel });
</script>

<style scoped>
/* No styles needed, using Tailwind classes */
</style>