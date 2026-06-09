import { computed, onMounted, onUnmounted, ref } from 'vue';

const DEFAULT_SCREEN_SIZE = 1920;

/**
 * 判断是否处于 pad_v 断点（601px ~ 840px）
 * @param width - 当前视口宽度
 * @returns 是否处于 pad_v 断点
 */
function isPadVBreakpoint(width: number): boolean {
  return width > 600 && width <= 840;
}

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
    isPadV: computed(() => isPadVBreakpoint(width.value)),
    isPhone: computed(() => width.value <= 600),
    width,
  };
};
