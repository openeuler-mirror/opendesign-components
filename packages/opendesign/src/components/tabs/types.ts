import { ExtractPropTypes, PropType } from 'vue';

export const tabsProps = {
  /**
   * tab选中的nav值
   * v-model
   */
  modelValue: {
    type: [String, Number],
    default: ''
  },
  /**
   * VariantT
   */
  variant: {
    type: String as PropType<'solid' | 'text'>,
    default: 'text'
  },
  /**
   * 是否激活时再加载
   */
  lazy: {
    type: Boolean,
  },
  /**
   * 是否可以添加页签
   */
  addable: {
    type: Boolean,
  },
  /**
   * 是否展示nav线
   */
  line: {
    type: Boolean,
    default: true
  },
  /**
   * 是否nav的横向排列布局，支持justify-content的所有值
   */
  navJustify: {
    type: String,
  },
};

export type TabsPropsT = ExtractPropTypes<typeof tabsProps>;


export const tabPaneProps = {
  /**
   * 页签项的key
   */
  value: {
    type: [String, Number],
    default: undefined,
  },
  /**
   * 页签项的文本，如果不传，使用nav插槽或者value
   */
  label: {
    type: String,
    default: undefined,
  },
  /**
   * 是否在隐藏时卸载页签内容
   */
  unmountOnHide: {
    type: Boolean,
    default: false,
  },
  /**
   * 页签切换时过渡动画
   */
  transition: {
    type: String,
    default: 'o-fade-in-enter',
  },
  /**
   * 是否禁用选中该页签
   */
  disabled: {
    type: Boolean,
    default: false,
  },
  /**
   * 是否可以删除该页签
   */
  closable: {
    type: Boolean,
    default: false,
  },
  /**
   * 是否页签首次激活时再加载页签内容
   */
  lazy: {
    type: Boolean,
    default: false,
  },
};

export type TabPanePropsT = ExtractPropTypes<typeof tabPaneProps>;