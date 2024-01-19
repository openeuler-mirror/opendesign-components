export interface PointT {
  x: number;
  y: number;
}
export interface PointMoveT {
  x: number;
  y: number;
  dx: number;
  dy: number;
}
export interface Point3DT {
  x: number;
  y: number;
  z: number;
}

// 尺寸
export const SizeTypes = ['large', 'medium', 'small'] as const;
export type SizeT = (typeof SizeTypes)[number];

// 圆角
export type RoundT = 'pill' | string;

// 方向
export const DirectionTypes = ['h', 'v'] as const;
export type DirectionT = (typeof DirectionTypes)[number];

// 位置
export const PositionTypes = ['left', 'right', 'top', 'bottom'] as const;
export type PositionT = (typeof PositionTypes)[number];

// 形状
export const VariantTypes = ['solid', 'outline', 'text'] as const;
export type VariantT = (typeof VariantTypes)[number];

// 颜色
export const ColorTypes = ['normal', 'primary', 'success', 'warning', 'danger'] as const;
export type ColorT = (typeof ColorTypes)[number];

// 颜色 表单元素
export const Color2Types = ['normal', 'success', 'warning', 'danger'] as const;
export type Color2T = (typeof ColorTypes)[number];
