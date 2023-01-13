import { ref } from 'vue';

// 尺寸
export type SizeT = 'large' | 'normal' | 'small'
export const defaultSize = ref<SizeT>('normal');
export function initSize(type: SizeT) {
  defaultSize.value = type;
}

// 形状
export type ShapeT = 'round' | 'normal'
export const defaultShape = ref<ShapeT>('normal');
export function initShape(type: ShapeT) {
  defaultShape.value = type;
}
