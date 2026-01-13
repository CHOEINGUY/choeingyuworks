<template>
  <div class="flex items-center gap-3 py-2">
    <div class="p-2 bg-blue-100 text-blue-600 rounded-lg shadow-sm">
      <span class="material-icons text-2xl">show_chart</span>
    </div>
    <h2 class="text-xl font-bold text-slate-800 tracking-tight">{{ title }}</h2>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title?: string;
}>();
</script>
