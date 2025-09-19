import { ExtractPropTypes, PropType } from 'vue';

export const ResultStatusTypes = ['info', 'success', 'warning', 'danger'] as const;
export type ResultStatusT = (typeof ResultStatusTypes)[number];

export const resultProps = {
  /**
   * @zh-CN 状态
   * @en-US Status.
   */
  status: {
    type: String as PropType<ResultStatusT>,
  },
  /**
   * @zh-CN 标题
   * @en-US Title.
   */
  title: {
    type: String,
  },
  /**
   * @zh-CN 描述
   * @en-US Description.
   */
  description: {
    type: String,
  },
};

export type ResultPropsT = ExtractPropTypes<typeof resultProps>;
