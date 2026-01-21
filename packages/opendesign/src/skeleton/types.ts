import type { ExtractPropTypes, PropType } from 'vue';
import { RoundT } from '../_utils/types';

export const skeletonTextProps = {
  /**
   * @zh-CN 文本行数
   * @en-US Number of lines of text.
   * @default 3
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
   * @zh-CN 头像尺寸
   * @en-US Avatar size.
   * @default 'medium'
   */
  size: {
    type: String as PropType<SkeletonAvatarSizeT>,
    default: 'medium',
  },
  /**
   * @zh-CN 圆角值
   * @en-US Round.
   * @default 'pill'
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
   * @zh-CN 是否显示加载中状态（即展示骨架屏）
   * @en-US Whether to display the loading status (i.e., show the skeleton screen).
   * @default true
   */
  loading: {
    type: Boolean,
    default: true,
  },
  /**
   * @zh-CN 是否展示动画
   * @en-US Whether to display the animation.
   * @default false
   */
  animation: {
    type: Boolean,
    default: false,
  },
  /**
   * @zh-CN 文本行数
   * @en-US Number of lines of textd.
   * @default 3
   */
  rows: {
    type: Number,
    default: 3,
  },
};

export type SkeletonPropsT = ExtractPropTypes<typeof skeletonProps>;
