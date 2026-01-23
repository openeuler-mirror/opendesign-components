import type { ExtractPropTypes, PropType, Component } from 'vue';
import type { DirectionT } from '../_utils/types';

export const StepItemStatusTypes = ['finished', 'processing', 'waiting', 'failed'] as const;
export type StepItemStatusT = (typeof StepItemStatusTypes)[number];

export const stepProps = {
  /**
   * @zh-CN 步骤条方向
   * @en-US Direction of the step bar.
   * @default 'h'
   */
  direction: {
    type: String as PropType<DirectionT>,
    default: 'h',
  },
};

export const stepItemProps = {
  /**
   * @zh-CN 标题
   * @en-US title
   */
  title: {
    type: String,
  },
  /**
   * @zh-CN 描述
   * @en-US description
   */
  description: {
    type: String,
  },
  /**
   * @zh-CN 状态
   * @en-US Status
   * @default 'finished'
   */
  status: {
    type: String as PropType<StepItemStatusT>,
    default: 'finished',
  },
  /**
   * @zh-CN 当前是第几步 从0记起
   * @en-US Which step is it currently? Counting from 0.
   */
  stepIndex: {
    type: Number,
    required: true,
  },
  /**
   * @zh-CN 步骤图标
   * @en-US Step icon.
   */
  icon: {
    type: [Boolean, Object] as PropType<boolean | Component>,
  },
} as const;

export type StepPropsT = ExtractPropTypes<typeof stepProps>;

export type StepItemPropsT = ExtractPropTypes<typeof stepItemProps>;
