import { ref, computed } from 'vue';
import { ColorPool } from './utils';
import { SizeT } from './types';
import { isClient, isTouchDevice } from './is';

// 尺寸
export const defaultSize = ref<SizeT>('medium');
export function initSize(val: SizeT) {
  defaultSize.value = val;
}

// 圆角
export const defaultRound = ref<'pill' | undefined>();
export function initRound(type?: 'pill') {
  defaultRound.value = type;
}

// 随机颜色池
const defaultPrestColor = ['#d9e6c3', '#ebd5be', '#d1e6de', '#e0ceeb', '#ebd3c7', '#e6dada', '#e3deeb', '#dedae6', '#cad0e8', '#cedeeb'];
export const defaultPrestColorPool = ref(new ColorPool(defaultPrestColor));
export function initPrestColor(colors: string[]) {
  defaultPrestColorPool.value = new ColorPool(colors);
}

// 断点
export const mediaPoint = ref<Record<'phone' | 'pad', number>>({
  phone: 720,
  pad: 1200,
});
export function initMediaPoint(point: Record<'phone' | 'pad', number>) {
  mediaPoint.value = point;
}

// 当前是否为pad
export const isPadSize = computed(() => {
  if (isClient) {
    const { innerWidth } = window;
    return innerWidth > mediaPoint.value.phone && innerWidth <= mediaPoint.value.pad;
  }
  return false;
});

// 当前是否为手机
export const isPhoneSize = computed(() => {
  if (isClient) {
    const { innerWidth } = window;
    return innerWidth <= mediaPoint.value.phone;
  }
  return false;
});

export const isNotPC = computed(() => {
  return isTouchDevice && (isPadSize.value || isPhoneSize.value);
});
