<template>
  <div v-if="isVisible" class="validation-progress">
    <div class="progress-container">
      <div class="progress-header">
        <span class="progress-title">{{ $t('dataInput.validation.validating') }}</span>
        <span class="progress-percentage">{{ Math.round(progress) }}%</span>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: progress + '%' }"></div>
      </div>
      <div class="progress-details">
        <span v-if="errorCount > 0" class="error-count">{{ $t('dataInput.validation.errorCount', { count: errorCount }) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  progress?: number;
  processed?: number;
  total?: number;
  errorCount?: number;
  isVisible?: boolean;
}>(), {
  progress: 0,
  processed: 0,
  total: 0,
  errorCount: 0,
  isVisible: false
});
</script>

<style scoped>
.validation-progress {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 9999;
  min-width: 300px;
}

.progress-container {
  text-align: center;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.progress-title {
  font-weight: 600;
  color: #333;
}

.progress-percentage {
  font-weight: bold;
  color: #007bff;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #007bff, #0056b3);
  transition: width 0.3s ease;
}

.progress-details {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #666;
}

.error-count {
  color: #dc3545;
  font-weight: 600;
}
</style> 