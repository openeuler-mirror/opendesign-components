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

export const Breakpoints = {
  Phone: 'phone',
  PadV: 'pad_v',
  PadH: 'pad_h',
  Laptop: 'laptop',
  Pc: 'pc',
} as const;

export type Breakpoints = (typeof Breakpoints)[keyof typeof Breakpoints];

type MediaPoints = Record<Breakpoints | 'pad', number>;

// 断点,值为断点上限
export const mediaPoint = ref<MediaPoints>({
  [Breakpoints.Phone]: 600,
  [Breakpoints.PadV]: 840,
  /**
   * @deprecated use padH
   */
  pad: 1200,
  [Breakpoints.PadH]: 1200,
  [Breakpoints.Laptop]: 1680,
  [Breakpoints.Pc]: 1920,
});

export function initMediaPoint(point: Partial<MediaPoints>) {
  mediaPoint.value = { ...mediaPoint.value, ...point };
}
