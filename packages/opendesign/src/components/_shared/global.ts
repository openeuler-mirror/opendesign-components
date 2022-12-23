import { ref } from 'vue';

// 尺寸
export enum Size {
  LARGE = 'large',
  NORMAL = 'normal',
  SMALL = 'small'
}

export const defaultSize = ref(Size.NORMAL);

export function initSize(type: Size) {
  defaultSize.value = type;
}

// 形状
export enum Shape {
  ROUND = 'round',
  NORMAL = 'normal'
}
export const defaultShape = ref(Shape.NORMAL);

export function initShape(shape: Shape) {
  defaultShape.value = shape;
}

export const OptionProvideKey = 'option-provide';
export interface OptionValueT {
  label: string;
  value: string | number;
}