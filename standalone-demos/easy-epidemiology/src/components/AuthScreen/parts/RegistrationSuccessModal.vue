<template>
  <BaseModal 
    :model-value="true" 
    @update:model-value="$emit('close')"
    :show-close-button="false"
    size="sm"
  >
    <div class="text-center p-4">
      <div class="mb-6 flex justify-center">
        <div class="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center">
          <span class="material-icons text-emerald-500 text-5xl">check_circle</span>
        </div>
      </div>
      <h3 class="text-2xl font-bold text-slate-900 mb-4 tracking-tight">회원가입이 완료되었습니다!</h3>
      <p class="text-slate-500 leading-relaxed mb-8">
        입력하신 정보가 정상적으로 등록되었습니다.<br>
        <strong class="text-slate-900 font-bold">상위 기관의 승인을 기다려주세요.</strong><br>
        승인 완료 후 로그인이 가능합니다.
      </p>
      <div class="flex justify-center">
        <BaseButton 
          class="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white border-none"
          size="lg"
          rounded="xl"
          shadow="lg"
          @click="$emit('close')"
        >
          확인
        </BaseButton>
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import BaseModal from '../../Common/BaseModal.vue';
import BaseButton from '../../Common/BaseButton.vue';

defineEmits<{
  (e: 'close'): void;
}>();
</script>

<style scoped>
/* All styles handled via Tailwind */
</style>
