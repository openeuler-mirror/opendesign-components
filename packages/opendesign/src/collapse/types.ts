import { ExtractPropTypes, PropType } from 'vue';

export const collapseProps = {
  /**
   * 是否开启手风琴模式
   */
  accordion: {
    type: Boolean,
    default: false,
  },

  /**
   * 折叠面板双向绑定值
   */
  modelValue: {
    type: Array as PropType<Array<string | number>>,
  },
  /**
   * 非受控模式时，默认展开的面板值
   */
  defaultValue: {
    type: Array as PropType<Array<string | number>>,
    default: () => [],
  },
};

export const collapseItemProps = {
  /**
   * 折叠面板value
   */
  value: {
    type: [String, Number],
    required: true,
  },
  /**
   * 折叠面板标题
   */
  title: {
    type: String,
  },
};

export type CollapsePropsT = ExtractPropTypes<typeof collapseProps>;
export type CollapseItemPropsT = ExtractPropTypes<typeof collapseItemProps>;
