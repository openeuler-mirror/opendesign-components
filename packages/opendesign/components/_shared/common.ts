import { ref } from 'vue';

// 尺寸
export enum SizeT {
  LARGE = 'large',
  NORMAL = 'normal',
  SMALL = 'small'
}

export const defaultSize = ref(SizeT.NORMAL);

export function initSize(type: SizeT) {
  defaultSize.value = type;
}

// 形状
export enum ShapeT {
  ROUND = 'round',
  CIRCLE = 'circle',
  NORMAL = 'normal'
}
export const defaultShape = ref(ShapeT.NORMAL);

export function initShape(shape: ShapeT) {
  defaultShape.value = shape;
}