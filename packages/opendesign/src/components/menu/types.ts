import type { ExtractPropTypes, PropType } from 'vue';

// MenuProps
export const menuProps = {
  /**
   * 是否开启手风琴模式
   */
  accordion: {
    type: Boolean,
    default: false,
  },
  /**
   * 层级缩进
   */
  levelIndent: {
    type: Number,
    default: 24,
  },
  /**
   * 默认选中值 v-model
   */
  modelValue: {
    type: String,
  },
  /**
   * 非受控模式时，默认选中值
   */
  defaultValue: {
    type: String,
    default: '',
  },
  /**
   * 默认展开的子菜单值 v-model
   */
  expanded: {
    type: Array as PropType<Array<string>>,
  },
  /**
   * 非受控模式时，默认展开的子菜单值
   */
  defaultExpanded: {
    type: Array as PropType<Array<string>>,
    default: () => [],
  },
};

export type MenuPropsT = ExtractPropTypes<typeof menuProps>;

// SubMenuProps
export const subMenuProps = {
  value: {
    type: String,
    required: true,
  },
};
export type SubMenuPropsT = ExtractPropTypes<typeof subMenuProps>;

// MenuItemProps
export const menuItemProps = {
  value: {
    type: String,
    required: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
};
export type MenuItemPropsT = ExtractPropTypes<typeof menuItemProps>;
