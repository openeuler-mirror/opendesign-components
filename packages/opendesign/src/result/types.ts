import { ExtractPropTypes, PropType } from 'vue';

export const ResultStatusTypes = ['info', 'success', 'warning', 'danger'] as const;
export type ResultStatusT = typeof ResultStatusTypes[number];

export const resultProps = {
  /**
   * 状态
   */
  status: {
    type: String as PropType<ResultStatusT>,
  },
  /**
   * 标题
   */
  title: {
    type: String,
  },
  /**
   * 描述
   **/
  description: {
    type: String,
  },
};

export type ResultPropsT = ExtractPropTypes<typeof resultProps>;
