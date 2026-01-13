import { ref } from 'vue';

export function useTooltip() {
  const activeTooltip = ref<string | null>(null);
  const tooltipText = ref<string>('');

  const showTooltip = (key: string, text: string) => {
    activeTooltip.value = key;
    tooltipText.value = text;
  };

  const hideTooltip = () => {
    activeTooltip.value = null;
  };

  return {
    activeTooltip,
    tooltipText,
    showTooltip,
    hideTooltip
  };
}
