<!-- 셀 편집 오버레이 컴포넌트 -->
<template>
  <Teleport to="body">
    <div
      v-show="visible"
      class="cell-edit-overlay"
      :style="overlayStyle"
      @click.stop
      @mousedown.stop
    >
      <input
        ref="inputRef"
        v-model="internalValue"
        class="edit-input"
        type="text"
        @keydown="handleKeyDown"
        @input="handleInput"
      />
      <!-- 텍스트 너비 측정을 위한 숨겨진 요소 -->
      <span ref="measureRef" class="width-measure">{{ internalValue || ' ' }}</span>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue';

interface Props {
  visible: boolean;
  position: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
  value: string;
  rowIndex: number;
  colIndex: number;
  selectOnFocus?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  position: () => ({ top: 0, left: 0, width: 100, height: 35 }),
  value: '',
  rowIndex: -1,
  colIndex: -1,
  selectOnFocus: true
});

const emit = defineEmits<{
  (e: 'update:value', value: string): void;
  (e: 'confirm', value: string): void;
  (e: 'cancel'): void;
  (e: 'input', value: string): void;
  (e: 'move-next-row'): void;
  (e: 'move-next-cell'): void;
}>();

const inputRef = ref<HTMLInputElement | null>(null);
const measureRef = ref<HTMLElement | null>(null);
const internalValue = ref('');
const contentWidth = ref(0);

// 값 동기화 및 초기 너비 계산
watch(() => props.value, (newVal) => {
  internalValue.value = newVal;
  nextTick(measureWidth);
}, { immediate: true });

// 입력 시 너비 재계산
function handleInput() {
  emit('input', internalValue.value);
  measureWidth();
}

/**
 * 텍스트 너비 측정
 */
function measureWidth() {
  if (measureRef.value) {
    // 텍스트 너비 + 패딩(왼쪽 8 + 오른쪽 8 + 여유분 10)
    contentWidth.value = measureRef.value.offsetWidth + 26;
  }
}

// visible이 true가 되면 input에 포커스 및 값 초기화
watch(() => props.visible, async (isVisible) => {
  if (isVisible) {
    // 중요: 오버레이가 다시 열릴 때 이전 상태가 남아있지 않도록 값을 props와 강제 동기화
    internalValue.value = props.value;
    
    await nextTick();
    measureWidth();
    
    // 약간의 지연을 주어 DOM 렌더링 및 다른 이벤트 처리 후 포커스 확보
    setTimeout(() => {
      if (inputRef.value) {
        inputRef.value.focus();
        if (props.selectOnFocus) {
          inputRef.value.select();
        } else {
          try {
             inputRef.value.selectionStart = inputRef.value.value.length;
             inputRef.value.selectionEnd = inputRef.value.value.length;
          } catch (e) {
             // selectionStart/End가 지원되지 않는 input type일 경우 무시
          }
        }
      }
    }, 10);
  }
});

const overlayStyle = computed(() => {
  // 최소 너비는 현재 셀의 너비
  // 텍스트가 길어지면 contentWidth만큼 확장
  const finalWidth = Math.max(props.position.width, contentWidth.value);
  
  return {
    position: 'fixed' as const,
    top: `${props.position.top}px`,
    left: `${props.position.left}px`,
    width: `${finalWidth}px`,
    height: `${props.position.height}px`,
    zIndex: 10000
  };
});



function handleKeyDown(event: KeyboardEvent) {
  // [중요] 오버레이 내부의 모든 키 이벤트는 그리드 핸들러(useGridInteraction)로 전파되지 않도록 차단합니다.
  // 이를 통해 포커스가 오버레이에 있을 때 그리드 네비게이션이나 편집 로직이 중복 실행되는 것을 방지합니다.
  event.stopPropagation();

  if (event.key === 'Enter') {
    event.preventDefault();
    emit('confirm', internalValue.value);
    emit('move-next-row');
  } else if (event.key === 'Tab') {
    event.preventDefault();
    emit('confirm', internalValue.value);
    emit('move-next-cell');
  } else if (event.key === 'Escape') {
    event.preventDefault();
    emit('cancel');
  }
}

// expose for parent access
defineExpose({ inputRef });
</script>

<style scoped>
.cell-edit-overlay {
  background: #fff;
  border: 2px solid #1a73e8;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(26, 115, 232, 0.2);
  border-radius: 2px;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  overflow: hidden; /* 내부 요소가 튀어나오지 않게 */
}

.edit-input {
  width: 100%;
  height: 100%;
  border: none !important;
  outline: none !important;
  font-family: inherit;
  font-size: 14px;
  padding: 0 8px;
  background: transparent;
  box-sizing: border-box;
  margin: 0;
}

.edit-input:focus {
  border: none !important;
  outline: none !important;
  box-shadow: none !important;
}

.width-measure {
  position: absolute;
  visibility: hidden;
  height: auto;
  width: auto;
  white-space: pre; /* 공백 유지 */
  font-family: inherit;
  font-size: 14px;
  padding: 0 8px; /* input 패딩과 동일하게 */
}
</style>
