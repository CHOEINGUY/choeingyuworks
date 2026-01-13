<template>
  <div class="data-guide-wrapper">
    <div class="data-guide-card">
      <div class="guide-header">
        <div class="guide-icon-box">
          <span class="material-icons guide-main-icon">{{ icon }}</span>
        </div>
        <h2 class="guide-title">{{ title }}</h2>
        <p class="guide-description">{{ description }}</p>
      </div>

      <div class="guide-steps">
        <div 
          v-for="(step, index) in steps" 
          :key="index" 
          class="step-card"
        >
          <div class="step-indicator">
            <span class="step-badge">{{ step.number }}</span>
            <div v-if="Number(index) < steps.length - 1" class="step-line"></div>
          </div>
          <div class="step-content">
            <div class="step-text">{{ step.text }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface GuideStep {
  number: string | number;
  text: string;
}

withDefaults(defineProps<{
  icon?: string;
  title: string;
  description: string;
  steps?: GuideStep[];
}>(), {
  icon: 'info',
  steps: () => []
});
</script>

<style scoped>
.data-guide-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  width: 100%;
  box-sizing: border-box;
}

.data-guide-card {
  max-width: 650px;
  width: 100%;
  background: #ffffff;
  border-radius: 20px;
  border: 1px solid #eef2f6;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04), 0 4px 8px rgba(0, 0, 0, 0.02);
  padding: 40px;
  transition: transform 0.3s ease;
}

.guide-header {
  text-align: center;
  margin-bottom: 35px;
}

.guide-icon-box {
  width: 64px;
  height: 64px;
  background: #f0f7ff;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  color: #1a73e8;
}

.guide-main-icon {
  font-size: 32px;
}

.guide-title {
  font-size: 1.6rem;
  font-weight: 600;
  color: #202124;
  margin: 0 0 12px 0;
  letter-spacing: -0.02em;
}

.guide-description {
  font-size: 1.05rem;
  color: #5f6368;
  line-height: 1.6;
  margin: 0;
}

.guide-steps {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.step-card {
  display: flex;
  gap: 20px;
}

.step-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 32px;
}

.step-badge {
  width: 32px;
  height: 32px;
  background: #1a73e8;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
  z-index: 2;
  box-shadow: 0 4px 10px rgba(26, 115, 232, 0.3);
}

.step-line {
  width: 2px;
  flex: 1;
  background: #eef2f6;
  margin: 4px 0;
}

.step-content {
  flex: 1;
  padding-bottom: 25px;
}

.step-card:last-child .step-content {
  padding-bottom: 0;
}

.step-text {
  font-size: 1.05rem;
  color: #3c4043;
  line-height: 1.5;
  padding-top: 4px;
  text-align: left;
}

/* Hover Effect */
.data-guide-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.06);
}
</style>
 