import { ref } from 'vue';

// 尺寸
export type SizeT = 'large' | 'medium' | 'small';
export const defaultSize = ref<SizeT>('medium');
export function initSize(val: SizeT) {
  defaultSize.value = val;
}

// 圆角
export type RoundT = 'pill' | string;
export const defaultRound = ref<{ m: string, s: string, l: string } | null>();

export function initRound(m: string, s: string, l: string) {
  defaultRound.value = {
    m, s, l
  };
}

// 方向
export type DirectionT = 'horizontal' | 'vertical';

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
