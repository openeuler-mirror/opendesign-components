import { computed, onMounted, onUnmounted, ref } from 'vue';
import { isTouchDevice } from '../_utils/is';
import { mediaPoint, Breakpoints } from '../_utils/global';

const DEFAULT_SCREEN_SIZE = 1920;
export const useScreen = () => {
  const width = ref(DEFAULT_SCREEN_SIZE);

  /**
   * 当前是否为手机
   * @deprecated 使用 isPhone 替代
   */
  const isPhoneSize = computed(() => width.value <= mediaPoint.value.phone);

  /**
   * 当前是否为pad
   * @deprecated 使用 isPadV / isPadH 替代
   */
  const isPadSize = computed(() => width.value > mediaPoint.value.phone && width.value <= mediaPoint.value.pad);

  /**
   * @deprecated 使用 lePadH 替代
   */
  const isPhonePadSize = computed(() => {
    return isPadSize.value || isPhoneSize.value;
  });
  /**
   * @deprecated 使用 lePadH 替代
   */
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

  // ---- phone 断点（0, 600] ----
  /** width ≤ phone */
  const isPhone = computed(() => width.value <= mediaPoint.value[Breakpoints.Phone]);
  /** width > phone */
  const gtPhone = computed(() => width.value > mediaPoint.value[Breakpoints.Phone]);

  // ---- pad_v 断点（601, 840] ----
  /** width ≤ pad_v */
  const lePadV = computed(() => width.value <= mediaPoint.value[Breakpoints.PadV]);
  /** phone < width ≤ pad_v */
  const isPadV = computed(() => gtPhone.value && lePadV.value);
  /** width > pad_v */
  const gtPadV = computed(() => width.value > mediaPoint.value[Breakpoints.PadV]);

  // ---- pad_h 断点（841, 1200] ----
  /** width ≤ pad_h */
  const lePadH = computed(() => width.value <= mediaPoint.value[Breakpoints.PadH]);
  /** pad_v < width ≤ pad_h */
  const isPadH = computed(() => gtPadV.value && lePadH.value);
  /** width > pad_h */
  const gtPadH = computed(() => width.value > mediaPoint.value[Breakpoints.PadH]);

  // ---- laptop 断点（1201, 1680] ----
  /** width ≤ laptop */
  const leLaptop = computed(() => width.value <= mediaPoint.value[Breakpoints.Laptop]);
  /** pad_h < width ≤ laptop */
  const isLaptop = computed(() => gtPadH.value && leLaptop.value);
  /** width > laptop */
  const gtLaptop = computed(() => width.value > mediaPoint.value[Breakpoints.Laptop]);

  // ---- pc 断点（1681, 1920] ----
  /** width ≤ pc */
  const lePc = computed(() => width.value <= mediaPoint.value[Breakpoints.Pc]);
  /** laptop < width ≤ pc */
  const isPc = computed(() => gtLaptop.value && lePc.value);
  /** width > pc */
  const gtPc = computed(() => width.value > mediaPoint.value[Breakpoints.Pc]);

  return {
    isTouchDevice,
    // 旧断点（已废弃，保留向后兼容）
    isPhoneSize,
    isPadSize,
    isPhonePadSize,
    isPhonePad,
    // 新断点
    isPhone,
    gtPhone,
    lePadV,
    isPadV,
    gtPadV,
    lePadH,
    isPadH,
    gtPadH,
    leLaptop,
    isLaptop,
    gtLaptop,
    lePc,
    isPc,
    gtPc,
  };
};
