<template>
  <div class="flex-1 p-5 border-r border-gray-100 font-['Noto_Sans_KR',_sans-serif]">
    <div class="flex items-center justify-between mb-4">
      <button @click.stop="prevMonth" class="bg-transparent border-none text-lg cursor-pointer p-2 rounded-md transition-colors hover:bg-gray-100">‹</button>
      
      <div class="flex gap-2 items-center">
        <select v-model="currentYear" class="px-2.5 py-1.5 border border-gray-200 rounded-md text-sm bg-white cursor-pointer min-w-[60px] focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 hover:border-blue-600" @click.stop>
          <option v-for="year in availableYears" :key="year" :value="year"
                  :class="{ 'bg-blue-50 text-blue-600 font-semibold': year === new Date().getFullYear() }">
            {{ year }}{{ $t('dataInput.datetime.yearSuffix') }}
          </option>
        </select>
        
        <select v-model="currentMonth" class="px-2.5 py-1.5 border border-gray-200 rounded-md text-sm bg-white cursor-pointer min-w-[60px] focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 hover:border-blue-600" @click.stop>
          <option v-for="m in 12" :key="m" :value="m">{{ m }}{{ $t('dataInput.datetime.monthSuffix') }}</option>
        </select>
      </div>
      
      <button @click.stop="nextMonth" class="bg-transparent border-none text-lg cursor-pointer p-2 rounded-md transition-colors hover:bg-gray-100">›</button>
    </div>
    
    <!-- 요일 헤더 -->
    <div class="grid grid-cols-7 gap-1 mb-2">
      <span v-for="day in weekdays" :key="day" class="text-center text-sm text-gray-500 py-2 font-medium">{{ day }}</span>
    </div>
    
    <!-- 날짜 그리드 -->
    <div 
      class="grid grid-cols-7 gap-1"
      role="grid"
      :aria-label="$t('dataInput.datetime.selectDate')"
    >
      <button 
        v-for="date in calendarDates" 
        :key="date.key"
        :class="getDateClass(date)"
        @click.stop="selectDate(date)"
        :disabled="date.disabled"
        role="gridcell"
        :aria-label="`${date.year}${$t('dataInput.datetime.yearSuffix')} ${date.month}${$t('dataInput.datetime.monthSuffix')} ${date.day}${$t('dataInput.datetime.daySuffix')}`"
        :aria-selected="isSelected(date)"
        :tabindex="isFocused(date) ? '0' : '-1'"
      >
        {{ date.day }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

interface Props {
  year?: number | null;
  month?: number | null;
  day?: number | null;
}

const props = withDefaults(defineProps<Props>(), {
  year: null,
  month: null,
  day: null
});

const emit = defineEmits<{
  (e: 'update:year', value: number): void;
  (e: 'update:month', value: number): void;
  (e: 'update:day', value: number): void;
  (e: 'select', date: any): void;
}>();

// 캘린더 표시용 현재 년/월
const currentYear = ref(new Date().getFullYear());
const currentMonth = ref(new Date().getMonth() + 1);

// 키보드 포커스된 날짜 (내부 상태)
const focusedDate = reactive<{
  year: number | null;
  month: number | null;
  day: number | null;
}>({
  year: null,
  month: null,
  day: null
});

// 요일 배열
const weekdays = computed(() => [
  t('dataInput.datetime.weekdays.sun'),
  t('dataInput.datetime.weekdays.mon'),
  t('dataInput.datetime.weekdays.tue'),
  t('dataInput.datetime.weekdays.wed'),
  t('dataInput.datetime.weekdays.thu'),
  t('dataInput.datetime.weekdays.fri'),
  t('dataInput.datetime.weekdays.sat')
]);

// 연도 범위 (현재 연도 기준 과거 5년)
const availableYears = computed(() => {
  const cYear = new Date().getFullYear();
  const years: number[] = [];
  for (let y = cYear - 5; y <= cYear; y++) {
    years.push(y);
  }
  return years;
});

interface CalendarDate {
  key: string;
  day: number;
  year: number;
  month: number;
  disabled: boolean;
  isPrevMonth?: boolean;
  isCurrentMonth?: boolean;
  isNextMonth?: boolean;
}

// 캘린더 날짜 생성
const calendarDates = computed(() => {
  const dates: CalendarDate[] = [];
  const year = currentYear.value;
  const month = currentMonth.value;
  
  // 첫 번째 날의 요일 (0: 일요일, 6: 토요일)
  const firstDay = new Date(year, month - 1, 1).getDay();
  
  // 이전 달의 마지막 날
  const prevMonthNum = month === 1 ? 12 : month - 1;
  const prevYearNum = month === 1 ? year - 1 : year;
  const prevMonthLastDate = new Date(prevYearNum, prevMonthNum, 0).getDate();
  
  // 현재 달의 마지막 날
  const currentMonthLastDate = new Date(year, month, 0).getDate();
  
  // 이전 달의 마지막 주 날짜들
  for (let i = firstDay - 1; i >= 0; i--) {
    dates.push({
      key: `prev-${prevMonthLastDate - i}`,
      day: prevMonthLastDate - i,
      year: prevYearNum,
      month: prevMonthNum,
      disabled: true,
      isPrevMonth: true
    });
  }
  
  // 현재 달의 날짜들
  for (let day = 1; day <= currentMonthLastDate; day++) {
    dates.push({
      key: `current-${day}`,
      day,
      year,
      month,
      disabled: false,
      isCurrentMonth: true
    });
  }
  
  // 다음 달의 첫 주 날짜들 (총 42칸 맞추기)
  const remainingCells = 42 - dates.length;
  const nextMonthNum = month === 12 ? 1 : month + 1;
  const nextYearNum = month === 12 ? year + 1 : year;
  
  for (let day = 1; day <= remainingCells; day++) {
    dates.push({
      key: `next-${day}`,
      day,
      year: nextYearNum,
      month: nextMonthNum,
      disabled: true,
      isNextMonth: true
    });
  }
  
  return dates;
});

// 날짜 클래스 계산
const getDateClass = (date: CalendarDate) => {
  // bg-transparent 제거 (조건부 적용을 위해)
  const baseClasses = 'border-none py-2.5 px-1 cursor-pointer rounded-lg text-sm transition-all min-h-[36px] flex items-center justify-center';
  const classes: string[] = [baseClasses];
  
  if (date.disabled) {
    classes.push('text-gray-300 cursor-not-allowed bg-transparent');
  }
  
  if (isSelected(date)) {
    // 선택된 경우: 파란 배경 + 흰색 텍스트 (bg-blue-600 강제 적용)
    classes.push('bg-blue-600 text-white font-semibold shadow-sm');
  } else {
    // 선택되지 않은 경우: 배경 투명
    if (!date.disabled) {
      classes.push('bg-transparent hover:bg-gray-100');
    }
    
    if (date.isCurrentMonth && !date.disabled) {
      classes.push('text-gray-800');
    }
  }
  
  // 키보드 포커스된 날짜 표시
  if (isFocused(date)) {
    classes.push('ring-2 ring-blue-600 ring-offset-0 z-[1]');
    if (isSelected(date)) {
      classes.push('ring-white ring-offset-0');
    }
  }
  
  // 오늘 날짜 표시
  const today = new Date();
  if (date.year === today.getFullYear() && 
      date.month === today.getMonth() + 1 && 
      date.day === today.getDate()) {
    // 오늘이지만 선택되지 않은 경우에만 표시
    if (!isSelected(date)) {
      classes.push('bg-blue-50 text-blue-600 font-semibold');
    }
  }
  
  return classes.join(' ');
};

const isSelected = (date: CalendarDate) => {
  return props.year === date.year && 
         props.month === date.month && 
         props.day === date.day;
};

const isFocused = (date: CalendarDate) => {
  return focusedDate.year === date.year && 
         focusedDate.month === date.month && 
         focusedDate.day === date.day;
};

// 월 이동
const prevMonth = () => {
  if (currentMonth.value === 1) {
    currentMonth.value = 12;
    currentYear.value--;
  } else {
    currentMonth.value--;
  }
};

const nextMonth = () => {
  if (currentMonth.value === 12) {
    currentMonth.value = 1;
    currentYear.value++;
  } else {
    currentMonth.value++;
  }
};

// 날짜 선택
const selectDate = (date: any) => {
  if (date.disabled) return;
  
  emit('update:year', date.year);
  emit('update:month', date.month);
  emit('update:day', date.day);
  emit('select', date);
  
  // 선택한 날짜와 포커스 동기화
  focusedDate.year = date.year;
  focusedDate.month = date.month;
  focusedDate.day = date.day;
  
  // 선택한 날짜가 다른 달이면 해당 달로 이동
  if (!date.isCurrentMonth) {
    currentYear.value = date.year;
    currentMonth.value = date.month;
  }
};

// --- 키보드 네비게이션 ---

const handleKeyDown = (event: KeyboardEvent) => {
  switch(event.key) {
  case 'ArrowLeft':
    event.preventDefault();
    navigateDate('left');
    break;
  case 'ArrowRight':
    event.preventDefault();
    navigateDate('right');
    break;
  case 'ArrowUp':
    event.preventDefault();
    navigateDate('up');
    break;
  case 'ArrowDown':
    event.preventDefault();
    navigateDate('down');
    break;
  case 'Home':
    event.preventDefault();
    navigateToFirstDay();
    break;
  case 'End':
    event.preventDefault();
    navigateToLastDay();
    break;
  case 'PageUp':
    event.preventDefault();
    if (event.shiftKey) {
      navigateYear(-1);
    } else {
      prevMonth();
    }
    break;
  case 'PageDown':
    event.preventDefault();
    if (event.shiftKey) {
      navigateYear(1);
    } else {
      nextMonth();
    }
    break;
  case ' ': // Spacebar
    event.preventDefault();
    selectFocusedDate();
    break;
  }
};

const navigateDate = (direction: 'left' | 'right' | 'up' | 'down') => {
  if (focusedDate.year === null || focusedDate.month === null || focusedDate.day === null) {
    // 초기화
    if (props.year && props.month && props.day) {
      focusedDate.year = props.year;
      focusedDate.month = props.month;
      focusedDate.day = props.day;
    } else {
      const today = new Date();
      focusedDate.year = today.getFullYear();
      focusedDate.month = today.getMonth() + 1;
      focusedDate.day = today.getDate();
    }
  }
  
  const currentDate = new Date(focusedDate.year!, (focusedDate.month || 1) - 1, (focusedDate.day || 1));
  
  switch (direction) {
  case 'left':
    currentDate.setDate(currentDate.getDate() - 1);
    break;
  case 'right':
    currentDate.setDate(currentDate.getDate() + 1);
    break;
  case 'up':
    currentDate.setDate(currentDate.getDate() - 7);
    break;
  case 'down':
    currentDate.setDate(currentDate.getDate() + 7);
    break;
  }
  
  focusedDate.year = currentDate.getFullYear();
  focusedDate.month = currentDate.getMonth() + 1;
  focusedDate.day = currentDate.getDate();
  
  // 뷰 동기화
  if (focusedDate.month !== currentMonth.value || focusedDate.year !== currentYear.value) {
    currentYear.value = focusedDate.year!;
    currentMonth.value = focusedDate.month!;
  }
};

const navigateYear = (delta: number) => {
  currentYear.value += delta;
};

const navigateToFirstDay = () => {
  focusedDate.year = currentYear.value;
  focusedDate.month = currentMonth.value;
  focusedDate.day = 1;
};

const navigateToLastDay = () => {
  const lastDay = new Date(currentYear.value, currentMonth.value, 0).getDate();
  focusedDate.year = currentYear.value;
  focusedDate.month = currentMonth.value;
  focusedDate.day = lastDay;
};

const selectFocusedDate = () => {
  if (focusedDate.year && focusedDate.month && focusedDate.day) {
    selectDate({
      year: focusedDate.year,
      month: focusedDate.month,
      day: focusedDate.day,
      isCurrentMonth: true // 이 부분은 단순 플래그로 사용
    });
  }
};

// 외부 Watchers
watch(() => [props.year, props.month, props.day], ([newY, newM, newD]) => {
  console.log('[CalendarPicker Debug] Props update:', { newY, newM, newD }, 'dayType:', typeof newD);
  if (newY && newM && newD) {
    focusedDate.year = newY;
    focusedDate.month = newM;
    focusedDate.day = newD;
    
    currentYear.value = newY;
    currentMonth.value = newM;
  } else {
    // 값이 없으면 오늘 날짜로 초기화
    const now = new Date();
    focusedDate.year = now.getFullYear();
    focusedDate.month = now.getMonth() + 1;
    focusedDate.day = now.getDate();
    
    currentYear.value = now.getFullYear();
    currentMonth.value = now.getMonth() + 1;
  }
}, { immediate: true });

defineExpose({
  handleKeyDown,
  prevMonth,
  nextMonth
});
</script>

<style scoped>
/* No styles needed, using Tailwind classes */
</style>
