import { ExtractPropTypes, PropType } from 'vue';
import type { SizeT } from '../_utils/types';

export const TabVariantTypes = ['solid', 'text'] as const;
export type TabVariantT = (typeof TabVariantTypes)[number];

export const tabProps = {
  /**
   * tab选中的nav值
   * v-model
   */
  modelValue: {
    type: [String, Number],
    default: undefined,
  },
  /**
   * 类型 TabVariantT
   */
  variant: {
    type: String as PropType<TabVariantT>,
    default: 'text',
  },
  /**
   * 大小 SizeT
   */
  size: {
    type: String as PropType<SizeT>,
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
   * 不激活新添加页签
   */
  addInactive: {
    type: Boolean,
  },
  /**
   * 是否展示nav线
   */
  line: {
    type: Boolean,
    default: true,
  },
};

export type TabPropsT = ExtractPropTypes<typeof tabProps>;

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
   * 页签切换时过渡动画
   */
  transition: {
    type: String,
    default: 'o-fade-in',
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
   * 是否页签首次激活前不渲染页签内容
   */
  lazy: {
    type: Boolean,
    default: false,
  },
  /**
   * 是否在隐藏时卸载页签内容
   */
  unmountOnHide: {
    type: Boolean,
    default: false,
  },
};

export type TabPanePropsT = ExtractPropTypes<typeof tabPaneProps>;
