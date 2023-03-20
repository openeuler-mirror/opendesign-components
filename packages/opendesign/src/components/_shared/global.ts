import { ref } from 'vue';

// 尺寸
export type SizeT = 'large' | 'medium' | 'small';
export const defaultSize = ref<SizeT>('medium');
export function initSize(val: SizeT) {
  defaultSize.value = val;
}

// 圆角
export type RoundT = 'pill' | 'normal' | string;
export const defaultRound = ref<'pill' | 'normal'>('normal');

export function initRound(type: 'pill' | 'normal') {
  defaultRound.value = type;
}
// TODO 全局变量增加 o-radius-control-s o-radius-control-m o-radius-control-l


// 方向
export type DirectionT = 'h' | 'v';

export type VariantT = 'solid' | 'outline' | 'text';

export type ColorT = 'normal' | 'primary' | 'success' | 'warning' | 'danger';


// todo 废弃
// 形状
export type ShapeT = 'round' | 'normal';
export const defaultShape = ref<ShapeT>('normal');
export function initShape(type: ShapeT) {
  defaultShape.value = type;
}
// 状态
export type StatusT = 'normal' | 'primary' | 'warning' | 'danger' | 'success';
