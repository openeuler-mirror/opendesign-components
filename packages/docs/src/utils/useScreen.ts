import { computed, onMounted, onUnmounted, ref } from 'vue';

const DEFAULT_SCREEN_SIZE = 0;
const isClient = typeof window !== 'undefined';
export const useScreen = () => {
  const width = ref(isClient ? window.innerWidth : DEFAULT_SCREEN_SIZE);

  const onResize = () => {
    width.value = window.innerWidth;
  };

  onMounted(() => {
    window.addEventListener('resize', onResize);
  });

  onUnmounted(() => {
    window.removeEventListener('resize', onResize);
  });

  return {
    lePad: computed(() => width.value <= 1200),
    lePadV: computed(() => width.value <= 840),
    isPadV: computed(() => width.value <= 840 && width.value > 600),
    isPhone: computed(() => width.value <= 600),
    width,
  };
};
