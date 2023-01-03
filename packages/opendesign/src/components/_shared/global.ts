import { ref } from 'vue';

// 尺寸
export enum Size {
  LARGE = 'large',
  NORMAL = 'normal',
  SMALL = 'small'
}
export type SizeT = 'large' | 'normal' | 'small'

export const defaultSize = ref<SizeT>('normal');

export function initSize(type: SizeT) {
  defaultSize.value = type;
}

// 形状
export enum Shape {
  ROUND = 'round',
  NORMAL = 'normal'
}
export type ShapeT = 'round' | 'normal'

export const defaultShape = ref<ShapeT>('normal');

export function initShape(shape: ShapeT) {
  defaultShape.value = shape;
}

export const OptionProvideKey = 'option-provide';
export interface OptionValueT {
  label: string;
  value: string | number;
}