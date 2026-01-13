<template>
  <div
    v-if="visible"
    ref="menuRef"
    class="context-menu"
    :style="menuStyle"
    @contextmenu.prevent
    @mousedown.stop
  >
    <template v-for="(item, index) in items" :key="index">
      <div v-if="item.type === 'separator'" class="context-menu-separator"></div>
      <div
        v-else-if="item.type === 'checkbox'"
        class="context-menu-item"
        @click="onItemClick(item)"
      >
        <input type="checkbox" :checked="item.checked" readonly style="margin-right:6px;pointer-events:none;" />
        <span class="context-menu-text">{{ getLabelText(item.label) }}</span>
        <span v-if="getCountText(item.label)" class="context-menu-count">{{ getCountText(item.label) }}</span>
      </div>
      <div
        v-else
        class="context-menu-item"
        :class="{ 'is-disabled': item.disabled, 'is-danger': item.danger }"
        @click="onItemClick(item)"
      >
        <span v-if="item.icon" class="context-menu-icon material-icons">{{ item.icon }}</span>
        <span class="context-menu-text">{{ item.label }}</span>
        <span v-if="item.shortcut" class="context-menu-shortcut">{{ item.shortcut }}</span>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, nextTick, computed } from 'vue';

interface MenuItem {
  label: string;
  action?: string;
  icon?: string;
  shortcut?: string;
  disabled?: boolean;
  danger?: boolean;
  type?: 'separator' | 'checkbox' | 'item';
  checked?: boolean;
}

const props = withDefaults(defineProps<{
  visible?: boolean;
  x?: number;
  y?: number;
  items?: MenuItem[];
}>(), {
  visible: false,
  x: 0,
  y: 0,
  items: () => []
});

const emit = defineEmits<{
  (e: 'select', action?: string): void;
}>();

const menuRef = ref<HTMLElement | null>(null);
const position = reactive({ x: 0, y: 0, opacity: 0, transformOrigin: 'top left' });

const menuStyle = computed(() => ({
  left: `${position.x}px`,
  top: `${position.y}px`,
  opacity: position.opacity,
  transformOrigin: position.transformOrigin
}));

const adjustPosition = () => {
  if (!menuRef.value) return;
  // body zoom 보정
  const bodyZoom = parseFloat(getComputedStyle(document.body).zoom) || 1;
  const menuWidth = menuRef.value.offsetWidth;
  const menuHeight = menuRef.value.offsetHeight;
  
  const vpWidthLogical = window.innerWidth / bodyZoom;
  const vpHeightLogical = window.innerHeight / bodyZoom;
  const SAFE_MARGIN = 8;

  // 기본 위치: 마우스 우측 하단 (Left-Top at Cursor + Overlap)
  // Shift 방식 대신 "뒤집기(Flip)" 방식 적용 (Standard Quadrant Logic)
  // 창 오른쪽에서는 메뉴가 마우스 왼쪽으로 뜨도록 함.
  
  let finalX = props.x;
  let finalY = props.y;
  let originX = 'left';
  let originY = 'top';
  
  // X축: 화면 오른쪽을 넘어가면 커서 기준으로 왼쪽으로 뒤집기 (Right Align)
  if (props.x + menuWidth > vpWidthLogical - SAFE_MARGIN) {
     finalX = props.x - menuWidth;
     originX = 'right';
  } else {
     finalX = props.x;
     originX = 'left';
  }
  
  // 왼쪽 벽을 뚫고 나가는 경우 (너무 왼쪽에서 클릭 시?) -> 왼쪽 벽에 붙임 (Clamp)
  if (finalX < SAFE_MARGIN) {
    finalX = SAFE_MARGIN;
    // 이 경우 커서랑 떨어지게 되므로 transform origin은 동적으로 계산 필요
  }

  // Y축: 화면 아래를 넘어가면 커서 기준으로 위로 뒤집기 (Bottom Align)
  if (props.y + menuHeight > vpHeightLogical - SAFE_MARGIN) {
     finalY = props.y - menuHeight;
     originY = 'bottom';
  } else {
     finalY = props.y;
     originY = 'top';
  }
  
  // 위쪽 벽을 뚫고 나가는 경우 -> 위쪽 벽에 붙임 (Clamp)
  if (finalY < SAFE_MARGIN) {
    finalY = SAFE_MARGIN;
  }

  position.x = finalX;
  position.y = finalY;

  // Transform Origin 설정
  // 기본적으로 'top left', 'top right' 등으로 설정하되,
  // Clamp가 발생해서 커서랑 떨어진 경우를 대비해 상대좌표로 미세조정.
  // (Flip만 발생했다면 props.x - finalX 는 0 또는 menuWidth가 됨)
  const relativeX = props.x - finalX;
  const relativeY = props.y - finalY;
  
  // Flip 상태에서는 relativeX가 menuWidth와 같음 -> 'right'
  // Normal 상태에서는 relativeX가 0 -> 'left'
  // Clamp 상태에서는 중간값.
  
  position.transformOrigin = `${relativeX}px ${relativeY}px`;
  position.opacity = 1;
};

watch(() => [props.visible, props.x, props.y], ([isVisible]) => {
  if (isVisible) {
    // 위치를 재계산하기 전에 메뉴를 잠시 투명하게 만듭니다.
    position.opacity = 0;
    nextTick(adjustPosition);
  }
}, { immediate: true });

const onItemClick = (item: MenuItem) => {
  if (item.disabled) return;
  emit('select', item.action);
};

// 괄호 부분을 분리하는 함수들
const getLabelText = (label: string) => {
  const match = label.match(/^(.+?)\s*\(\d+\)$/);
  return match ? match[1] : label;
};

const getCountText = (label: string) => {
  const match = label.match(/\((\d+)\)$/);
  return match ? `${match[1]}개` : '';
};
</script>

<style scoped>
@import './ContextMenu.css';
</style>
 