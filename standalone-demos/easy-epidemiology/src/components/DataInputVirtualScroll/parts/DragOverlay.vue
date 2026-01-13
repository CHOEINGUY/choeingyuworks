<template>
  <transition name="fade">
    <div v-if="visible" class="drag-overlay">
      <div class="overlay-content">
        <span class="material-icons-outlined icon">cloud_upload</span>
        <p class="text">{{ $t('dataInput.overlay.dropExcel') }}</p>
        <p v-if="progress > 0 && progress < 100" class="progress">{{ progress }}%</p>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  visible?: boolean;
  progress?: number;
}>(), {
  visible: false,
  progress: 0
});
</script>

<style scoped>
.drag-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  pointer-events: none;
}
.overlay-content {
  text-align: center;
  color: #ffffff;
  pointer-events: none;
}
.icon {
  font-size: 64px;
  opacity: 0.9;
}
.text {
  font-size: 20px;
  margin-top: 8px;
  opacity: 0.9;
}
.progress {
  margin-top: 4px;
  font-size: 16px;
  opacity: 0.85;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .2s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style> 