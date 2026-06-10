import { ExtractPropTypes, PropType, VNode } from 'vue';

export const ObjectFitTypes = ['fill', 'contain', 'cover', 'none', 'scale-down'] as const;
export type ObjectFitT = (typeof ObjectFitTypes)[number];

export const avatarProps = {
  /**
   * @zh-CN 尺寸，支持数字、CSS 变量或带单位的值
   * @en-US Size, supports number, CSS variable or unit value
   */
  size: {
    type: [Number, String] as PropType<number | string>,
    default: 'var(--o-icon_size-4xl)',
  },
  /**
   * @zh-CN CSS background
   * @en-US CSS background
   */
  background: {
    type: String,
  },
  /**
   * @zh-CN 头像图片地址
   * @en-US Avatar image URL
   */
  url: {
    type: String,
  },
  /**
   * @zh-CN 头像名称，用于展示首字符（当无 url 时生效）
   * @en-US Avatar name, displays the first character (takes effect when url is absent)
   */
  name: {
    type: String,
  },
  /**
   * @zh-CN 名称渲染函数，接收 name 属性，返回 VNode 自定义渲染
   * @en-US Name formatter, receives name prop and returns VNode for custom rendering
   */
  nameFormatter: {
    type: Function as PropType<(data: { name?: string }) => VNode>,
  },
  /**
   * @zh-CN 是否可点击，开启后 hover 显示遮罩层与编辑图标
   * @en-US Whether the avatar is clickable. When enabled, a mask with edit icon shows on hover
   * @default false
   */
  clickable: {
    type: Boolean,
    default: false,
  },
  /**
   * @zh-CN 图片填充方式
   * @en-US Image object-fit mode
   * @default 'fill'
   */
  objectFit: {
    type: String as PropType<ObjectFitT>,
    default: 'fill',
  },
};

export type AvatarPropsT = ExtractPropTypes<typeof avatarProps>;

// AvatarGroup types
export type AvatarGroupLayout = 'horizontal' | 'symmetric';

/**
 * @zh-CN 头像组项数据
 * @en-US Avatar group item data
 */
export interface AvatarItem {
  /**
   * @zh-CN 图片地址
   * @en-US img src
   * */
  url?: string;
  /**
   * @zh-CN 名称
   * @en-US name
   * */
  name?: string;
  /**
   * @zh-CN CSS background
   * @en-US CSS background
   */
  background?: string;
}

export const avatarGroupProps = {
  /**
   * @zh-CN 头像列表
   * @en-US Avatar list
   */
  urlList: {
    type: Array as PropType<AvatarItem[]>,
    default: () => [],
  },
  /**
   * @zh-CN 尺寸，统一设置组内所有头像的大小
   * @en-US Size, applied to all avatars in the group
   * @default 'var(--o-icon_size-s)'
   */
  size: {
    type: [Number, String] as PropType<number | string>,
    default: 'var(--o-icon_size-s)',
  },
  /**
   * @zh-CN 布局模式：`horizontal` 水平堆叠（最多显示 2 个 + 溢出提示），`symmetric` 对称排列（最多显示 4 个）
   * @en-US Layout mode: `horizontal` stacking (max 2 visible + overflow), `symmetric` grid (max 4 visible)
   * @default 'horizontal'
   */
  layout: {
    type: String as PropType<AvatarGroupLayout>,
    default: 'horizontal',
  },
  /**
   * @zh-CN 溢出头像的展示方式：`ellipsis` 显示省略号图标，`count` 显示 +N 数量
   * @en-US Overflow avatar display: `ellipsis` shows icon, `count` shows +N count
   * @default 'ellipsis'
   */
  overflowType: {
    type: String as PropType<'ellipsis' | 'count'>,
    default: 'ellipsis',
  },
  objectFit: avatarProps.objectFit,
  nameFormatter: avatarProps.nameFormatter,
};

export type AvatarGroupPropsT = ExtractPropTypes<typeof avatarGroupProps>;
