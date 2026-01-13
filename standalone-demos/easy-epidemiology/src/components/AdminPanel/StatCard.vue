
<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  title: { type: String, required: true },
  count: { type: [Number, String], required: true },
  icon: { type: String, required: true },
  color: { 
    type: String, 
    default: 'blue',
    validator: (value: string) => ['blue', 'amber', 'emerald', 'primary'].includes(value)
  }
});

// Mapping for tailwind classes to ensure they are preserved
// Note: 'primary' color usually needs to be defined in tailwind config. 
// Assuming specific shades for standard colors.
const colorClasses = computed(() => {
  const colors = {
    blue: {
      bg: 'bg-blue-500/10',
      text: 'text-blue-400',
      border: 'border-blue-500/10',
      hoverBg: 'group-hover:bg-blue-500',
      hoverShadow: 'group-hover:shadow-[0_0_30px_rgba(59,130,246,0.5)]'
    },
    amber: {
      bg: 'bg-amber-500/10',
      text: 'text-amber-400',
      border: 'border-amber-500/10',
      hoverBg: 'group-hover:bg-amber-500',
      hoverShadow: 'group-hover:shadow-[0_0_30px_rgba(245,158,11,0.5)]'
    },
    emerald: {
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-400',
      border: 'border-emerald-500/10',
      hoverBg: 'group-hover:bg-emerald-500',
      hoverShadow: 'group-hover:shadow-[0_0_30px_rgba(16,185,129,0.5)]'
    },
    primary: {
      bg: 'bg-primary-500/10',
      text: 'text-primary-400',
      border: 'border-primary-500/10',
      hoverBg: 'group-hover:bg-primary-500',
      hoverShadow: 'group-hover:shadow-[0_0_30px_rgba(var(--primary-500),0.5)]'
    }
  } as const;
  return colors[props.color as keyof typeof colors];
});
</script>

<!-- Overwrite the template above to use the computed classes -->
<template>
  <div class="flex items-center gap-6 flex-1 min-w-[200px] md:min-w-0 transition-all duration-500 hover:-translate-y-1.5 group relative z-10">
    <div 
      class="w-16 h-16 rounded-2.5xl flex items-center justify-center transition-all duration-500 border group-hover:text-white group-hover:border-transparent"
      :class="[
        colorClasses.bg,
        colorClasses.text,
        colorClasses.border,
        colorClasses.hoverBg,
        colorClasses.hoverShadow
      ]"
    >
      <span class="material-icons text-3xl">{{ icon }}</span>
    </div>
    <div class="flex flex-col">
      <span class="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black px-0.5">{{ title }}</span>
      <span class="text-4xl font-extrabold text-white tracking-tighter leading-none mt-2">{{ count }}</span>
    </div>
  </div>
</template>
