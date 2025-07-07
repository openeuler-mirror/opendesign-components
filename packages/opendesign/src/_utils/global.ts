import { ref } from 'vue';
import { ColorPool } from './helper';
import { SizeT } from './types';

// popup\popover\layer\dialog的初始z-index
export const defaultZIndex = ref<number>(1000);
export function initZIndex(val: number) {
  defaultZIndex.value = val;
}

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
  phone: 600,
  pad: 1200,
});
export function initMediaPoint(point: Record<'phone' | 'pad', number>) {
  mediaPoint.value = point;
}
