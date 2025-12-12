import type { ExtractPropTypes, PropType, Component } from 'vue';

export const MenuSizeTypes = ['medium', 'small'] as const;
export type MenuSizeT = (typeof MenuSizeTypes)[number];

// MenuProps
export const menuProps = {
  /**
   * @zh-CN 菜单尺寸
   * @en-US Menu size
   * @default 'medium'
   */
  size: {
    type: String as PropType<MenuSizeT>,
    default: 'medium',
  },
  /**
   * @zh-CN 是否开启手风琴模式
   * @en-US Whether to enable accordion mode
   * @default false
   */
  accordion: {
    type: Boolean,
    default: false,
  },
  /**
   * @zh-CN 选中值
   * @en-US Selected value
   */
  modelValue: {
    type: String,
  },
  /**
   * @zh-CN 非受控模式时，默认选中值
   * @en-US Default selected value when not controlled
   * @default ''
   */
  defaultValue: {
    type: String,
    default: '',
  },
  /**
   * @zh-CN 展开节点值
   * @en-US Expanded node value
   */
  expanded: {
    type: Array as PropType<Array<string>>,
  },
  /**
   * @zh-CN 非受控模式时，默认展开节点值
   * @en-US Default expanded node value when not controlled
   * @default []
   */
  defaultExpanded: {
    type: Array as PropType<Array<string>>,
    default: () => [],
  },
  // 父子节点是否关联
  selectStrictly: {
    type: Boolean,
    default: false,
  },
  arrowPosition: {
    type: String as PropType<'left'|'right'>,
  }
};

export type MenuPropsT = ExtractPropTypes<typeof menuProps>;

// SubMenuProps
export const subMenuProps = {
  /**
   * @zh-CN 菜单项值
   * @en-US Menu item value
   */
  value: {
    type: String,
    required: true as const,
  },
  /**
   * @zh-CN 菜单项是否可选
   * @en-US Whether the menu item is selectable
   */
  selectable: {
    type: Boolean,
  },
  /**
   * @zh-CN 前缀图标
   * @en-US Prefix icon
   */
  icon: {
    type: Object as PropType<Component>,
  },
};
export type SubMenuPropsT = ExtractPropTypes<typeof subMenuProps>;

// MenuItemProps
export const menuItemProps = {
  /**
   * @zh-CN 菜单项值
   * @en-US Menu item value
   */
  value: {
    type: String,
    required: true as const,
  },
  /**
   * @zh-CN 前缀图标
   * @en-US Prefix icon
   */
  icon: {
    type: Object as PropType<Component>,
  },
  /**
   * @zh-CN 禁用
   * @en-US Disabled
   * @default false
   */
  disabled: {
    type: Boolean,
    default: false,
  },
};
export type MenuItemPropsT = ExtractPropTypes<typeof menuItemProps>;
