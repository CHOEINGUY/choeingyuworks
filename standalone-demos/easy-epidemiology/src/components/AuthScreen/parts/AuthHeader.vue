<template>
  <div class="mb-2">
    <h2 class="text-2xl font-bold text-slate-900 tracking-tight">
      {{ title }}
    </h2>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string;
}

withDefaults(defineProps<Props>(), {
  title: '로그인'
});
</script>

<style scoped>
/* All styles handled via Tailwind */
</style>
