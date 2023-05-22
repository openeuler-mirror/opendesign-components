import { ref } from 'vue';
import { ColorPool } from './utils';
import { SizeT } from './types';

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
