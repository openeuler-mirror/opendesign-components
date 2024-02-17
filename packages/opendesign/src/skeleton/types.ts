import type { ExtractPropTypes, PropType } from 'vue';
import { RoundT } from '../_utils/types';

export const skeletonTextProps = {
  /**
   * 行数
   */
  rows: {
    type: Number,
    default: 3,
  },
};

export type SkeletonTextPropsT = ExtractPropTypes<typeof skeletonTextProps>;

export const SkeletonAvatarSizeTypes = ['large', 'medium', 'small', 'mini'] as const;
export type SkeletonAvatarSizeT = (typeof SkeletonAvatarSizeTypes)[number];

export const skeletonAvatarProps = {
  /**
   * 头像尺寸
   */
  size: {
    type: String as PropType<SkeletonAvatarSizeT>,
    default: 'medium',
  },
  /**
   * 圆角值 RoundT
   */
  round: {
    type: String as PropType<RoundT>,
    default: 'pill',
  },
};

export type SkeletonAvatarPropsT = ExtractPropTypes<typeof skeletonAvatarProps>;

export const skeletonFigureProps = {};

export type SkeletonFigurePropsT = ExtractPropTypes<typeof skeletonFigureProps>;

export const skeletonProps = {
  /**
   * 是否显示加载中状态（即展示骨架屏）
   */
  loading: {
    type: Boolean,
    default: true,
  },
  /**
   * 是否展示动画
   */
  animation: {
    type: Boolean,
    default: false,
  },
  /**
   * 行数
   */
  rows: {
    type: Number,
    default: 3,
  },
};

export type SkeletonPropsT = ExtractPropTypes<typeof skeletonProps>;
