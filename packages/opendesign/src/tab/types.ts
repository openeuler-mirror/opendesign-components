import { ExtractPropTypes, PropType } from 'vue';
import type { SizeT } from '../_utils/types';

export const TabVariantTypes = ['solid', 'text'] as const;
export type TabVariantT = (typeof TabVariantTypes)[number];

type ClassT = string | Record<string, boolean> | ClassT[];
export const tabProps = {
  /**
   * @zh-CN 选中页签值 v-model
   * @en-US Selected tab value v-model
   */
  modelValue: {
    type: [String, Number],
    default: undefined,
  },
  /**
   * @zh-CN 页签类型
   * @en-US Tab variant
   * @default 'text'
   */
  variant: {
    type: String as PropType<TabVariantT>,
    default: 'text',
  },
  /**
   * @zh-CN 页签尺寸
   * @en-US Tab size
   */
  size: {
    type: String as PropType<SizeT>,
  },
  /**
   * @zh-CN 是否首次激活后再渲染
   * @en-US Whether to render the tab content after the first activation
   */
  lazy: {
    type: Boolean,
  },
  /**
   * @zh-CN 是否可添加页签
   * @en-US Whether tabs can be added
   */
  addable: {
    type: Boolean,
  },
  /**
   * @zh-CN 是否激活新添加的页签
   * @en-US Whether to activate the newly added tab
   */
  addInactive: {
    type: Boolean,
  },
  /**
   * @zh-CN 是否展示nav线
   * @en-US Whether to show the nav line
   * @default true
   */
  line: {
    type: Boolean,
    default: true,
  },
  /**
   * @zh-CN 头部自定义样式类名
   * @en-US Header custom style class name
   */
  headerClass: {
    type: [String, Array, Object] as PropType<string | { [k: string]: boolean } | Array<{ [k: string]: boolean } | string>>,
  },
};

export type TabPropsT = ExtractPropTypes<typeof tabProps>;

export const tabPaneProps = {
  /**
   * @zh-CN 页签值
   * @en-US Tab value
   */
  value: {
    type: [String, Number],
    default: undefined,
  },
  /**
   * @zh-CN 页签标题
   * @en-US Tab title
   */
  label: {
    type: String,
    default: undefined,
  },
  /**
   * @zh-CN 页签切换时过渡动画
   * @en-US Transition animation for tab switching
   * @default 'o-fade-in'
   */
  transition: {
    type: String,
    default: 'o-fade-in',
  },
  /**
   * @zh-CN 是否禁用选中该页签
   * @en-US Whether to disable selecting this tab
   * @default false
   */
  disabled: {
    type: Boolean,
    default: false,
  },
  /**
   * @zh-CN 是否可以删除该页签
   * @en-US Whether the tab can be deleted
   * @default false
   */
  closable: {
    type: Boolean,
    default: false,
  },
  /**
   * @zh-CN 是否在首次激活时才渲染页签内容
   * @en-US Whether to render the tab content only when the tab is first activated
   * @default false
   */
  lazy: {
    type: Boolean,
    default: false,
  },
  /**
   * @zh-CN 是否在隐藏时卸载页签内容
   * @en-US Whether to unmount the tab content when hidden
   * @default false
   */
  unmountOnHide: {
    type: Boolean,
    default: false,
  },
};

export type TabPanePropsT = ExtractPropTypes<typeof tabPaneProps>;
