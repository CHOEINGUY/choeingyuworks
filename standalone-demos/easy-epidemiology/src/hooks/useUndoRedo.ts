// src/hooks/useUndoRedo.ts
// 전역 키보드 단축키로 StoreBridge의 undo/redo를 호출하는 컴포지션 훅
// 사용법: const { onBeforeUnmount } from 'vue'; useUndoRedo(storeBridge);

import { onMounted, onBeforeUnmount } from 'vue';

interface StoreBridge {
  undo: () => void;
  redo: () => void;
}

export function useUndoRedo(storeBridge: StoreBridge): void {
  if (!storeBridge) {
    console.warn('[useUndoRedo] storeBridge 인스턴스가 필요합니다.');
    return;
  }

  const handler = (e: KeyboardEvent): void => {
    if (!(e.ctrlKey || e.metaKey)) return;

    // Mac ⌘, Windows/Linux Ctrl 공통 처리
    // Ctrl+Z: Undo, Ctrl+Shift+Z 또는 Ctrl+Y: Redo
    if (e.key.toLowerCase() === 'z') {
      if (e.shiftKey) {
        e.preventDefault();
        storeBridge.redo();
      } else {
        e.preventDefault();
        storeBridge.undo();
      }
    } else if (e.key.toLowerCase() === 'y') {
      e.preventDefault();
      storeBridge.redo();
    }
  };

  onMounted(() => {
    document.addEventListener('keydown', handler);
  });

  onBeforeUnmount(() => {
    document.removeEventListener('keydown', handler);
  });
}
