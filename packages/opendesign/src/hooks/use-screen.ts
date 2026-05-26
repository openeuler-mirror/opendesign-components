import { computed, onMounted, onUnmounted, ref } from 'vue';
import { isTouchDevice } from '../_utils/is';
import { mediaPoint } from '../_utils/global';

const DEFAULT_SCREEN_SIZE = 1920;
export const useScreen = () => {
  const width = ref(DEFAULT_SCREEN_SIZE);

  // 当前是否为手机
  const isPhoneSize = computed(() => width.value <= mediaPoint.value.phone);

  // 当前是否为pad
  const isPadSize = computed(() => width.value > mediaPoint.value.phone && width.value <= mediaPoint.value.pad);

  const isPhonePadSize = computed(() => {
    return isPadSize.value || isPhoneSize.value;
  });
  const isPhonePad = computed(() => {
    return isTouchDevice && isPhonePadSize.value;
  });

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
    isTouchDevice,
    isPhoneSize,
    isPadSize,
    isPhonePadSize,
    isPhonePad,
  };
};
