import { ExtractPropTypes, PropType } from 'vue';
import { RoundT, SizeT } from '../_utils/types';

export const TagColorTypes = ['normal', 'info', 'primary', 'success', 'warning', 'danger', 'pending', 'disabled', 'main2'] as const;
export type TagColorT = (typeof TagColorTypes)[number];

export const TagVariantTypes = ['solid', 'outline'] as const;
export type TagVariantT = (typeof TagVariantTypes)[number];

export const tagProps = {
  /**
   * @zh-CN 标签颜色 ['pending', 'disabled', 'main2']为 1.2.6 版本新增
   * @en-US Tag color ['pending', 'disabled', 'main2'] new in 1.2.6
   * @default 'normal'
   */
  color: {
    type: String as PropType<TagColorT>,
    default: 'normal',
  },
  /**
   * @zh-CN 标签类型
   * @en-US Tag variant
   * @default 'solid'
   */
  variant: {
    type: String as PropType<TagVariantT>,
    default: 'solid',
  },
  /**
   * @zh-CN 标签尺寸
   * @en-US Tag size
   * @default 'large'
   */
  size: {
    type: String as PropType<SizeT>,
    default: 'large',
  },
  /**
   * @zh-CN 标签圆角
   * @en-US Tag round
   */
  round: {
    type: String as PropType<RoundT>,
  },
  /**
   * @zh-CN 是否可关闭
   * @en-US Whether closable
   * @default false
   */
  closable: {
    type: Boolean,
    default: false,
  },
  /**
   * @zh-CN 是否可交互，用于渲染不同的交互态样式
   * @en-US Whether interactive, used to render different interaction state styles
   * @default 当 closable 为 true 时默认 true，否则 false
   * @since 1.2.6
   */
  interactive: {
    type: Boolean,
    default: false,
  },
  /**
   * @zh-CN 是否可见 (双向绑定)
   * @en-US Whether visible (two-way binding)
   */
  visible: {
    type: Boolean,
    default: undefined,
  },
  /**
   * @zh-CN 非受控模式，是否默认可见
   * @en-US Uncontrolled mode, whether visible by default
   * @default true
   */
  defaultVisible: {
    type: Boolean,
    default: true,
  },
  /**
   * @zh-CN 关闭前的钩子函数
   * @en-US Hook function before closing
   */
  beforeClose: {
    type: Function as PropType<() => Promise<boolean> | boolean>,
  },
};

export type TagPropsT = ExtractPropTypes<typeof tagProps>;
