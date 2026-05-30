import { computed, onMounted, onUnmounted, ref } from 'vue';

const DEFAULT_SCREEN_SIZE = 1920;
export const useScreen = () => {
  const width = ref(DEFAULT_SCREEN_SIZE);

  const onResize = () => {
    width.value = window.innerWidth;
  };

  onMounted(() => {
    onResize();
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
