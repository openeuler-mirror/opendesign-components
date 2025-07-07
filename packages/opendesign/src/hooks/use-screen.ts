import { computed, onMounted, onUnmounted, ref } from 'vue';
import { isClient, isTouchDevice } from '../_utils/is';
import { mediaPoint } from '../_utils/global';

const DEFAULT_SCREEN_SIZE = 0;
export const useScreen = () => {
  const width = ref(isClient ? window.innerWidth : DEFAULT_SCREEN_SIZE);

  // 当前是否为手机
  const isPhoneSize = computed(() => {
    if (isClient) {
      return width.value <= mediaPoint.value.phone;
    }
    return false;
  });

  // 当前是否为pad
  const isPadSize = computed(() => {
    if (isClient) {
      return width.value > mediaPoint.value.phone && width.value <= mediaPoint.value.pad;
    }
    return false;
  });

  const isPhonePad = computed(() => {
    return isTouchDevice && (isPadSize.value || isPhoneSize.value);
  });

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
    isTouchDevice,
    isPhoneSize,
    isPadSize,
    isPhonePad,
  };
};
