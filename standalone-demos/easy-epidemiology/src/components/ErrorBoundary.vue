<template>
  <div v-if="error" class="error-boundary">
    <div class="error-content">
      <h3>오류가 발생했습니다</h3>
      <p>{{ error.message }}</p>
      <button @click="resetError" class="retry-button">
        다시 시도
      </button>
      <details v-if="error.stack" class="error-details">
        <summary>상세 정보</summary>
        <pre>{{ error.stack }}</pre>
      </details>
    </div>
  </div>
  <slot v-else />
</template>

<script setup lang="ts">
import { ref, onErrorCaptured, type ComponentPublicInstance } from 'vue';
import { createComponentLogger } from '../utils/logger';

const logger = createComponentLogger('ErrorBoundary');
const error = ref<Error | null>(null);

onErrorCaptured((err: Error, instance: ComponentPublicInstance | null, info: string) => {
  logger.error('Error captured:', err, info);
  error.value = err;
  return false; // 에러 전파 중단
});

function resetError() {
  error.value = null;
}
</script>

<style scoped>
.error-boundary {
  padding: 20px;
  border: 1px solid #ff6b6b;
  border-radius: 8px;
  background-color: #fff5f5;
  margin: 10px;
}

.error-content {
  text-align: center;
}

.error-content h3 {
  color: #d63031;
  margin-bottom: 10px;
}

.error-content p {
  color: #636e72;
  margin-bottom: 15px;
}

.retry-button {
  background-color: #00b894;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.retry-button:hover {
  background-color: #00a085;
}

.error-details {
  margin-top: 15px;
  text-align: left;
}

.error-details summary {
  cursor: pointer;
  color: #636e72;
  font-weight: bold;
}

.error-details pre {
  background-color: #f8f9fa;
  padding: 10px;
  border-radius: 4px;
  font-size: 12px;
  overflow-x: auto;
  margin-top: 10px;
}
</style> 