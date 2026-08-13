import { PopupPositionT, PopupTriggerT } from '../popup';
import { ExtractPropTypes, PropType, VNodeChild } from 'vue';
import type { SizeT, RoundT, VariantT, Color2T } from '../_utils/types';
import { virtualListProps } from '../virtual-list';

export const OptionWidthModeTypes = ['auto', 'min-width', 'width'] as const;
export type OptionWidthModeT = (typeof OptionWidthModeTypes)[number];

export interface SelectOptionT {
  label: string;
  value: string | number;
}

export type SelectValueT = string | number | string[] | number[] | (string | number)[];

/**
 * options prop 数据驱动模式的选项数据
 * @since NEXT
 */
export interface SelectOptionData {
  label: string;
  value: string | number;
  disabled?: boolean;
  [key: string]: unknown;
}

/**
 * options prop 数据驱动模式的分组数据
 * @since NEXT
 */
export interface SelectOptionGroupData {
  type: 'group';
  key: string | number;
  label: string;
  children: SelectOptionData[];
}

/**
 * options prop 接受的混合类型（扁平选项或分组）
 * @since NEXT
 */
export type SelectMixedOption = SelectOptionData | SelectOptionGroupData;

/**
 * fieldNames 字段名定制接口
 * @since NEXT
 */
export interface SelectFieldNames {
  value?: string;
  label?: string;
  disabled?: string;
  children?: string;
  options?: string;
}

/**
 * 虚拟滚动模式下的扁平化列表项
 * @description 将分组选项展平为统一结构，供 OVirtualList 渲染
 * @since NEXT
 */
export interface SelectVirtualItem {
  /** 虚拟列表项唯一标识，用于 OVirtualList 不定高模式下的稳定定位 */
  id: string | number;
  /** 项类型：option 或 group-header */
  type: 'option' | 'group-header';
  /** 选项值（仅 type='option' 时有效） */
  value?: string | number;
  /** 显示文本 */
  label?: string;
  /** 是否禁用（仅 type='option' 时有效） */
  disabled?: boolean;
  /** 分组 key（仅 type='group-header' 时有效） */
  groupKey?: string | number;
  /** 原始选项数据，保留父组件传入的所有自定义字段，供 renderLabel / #option-label 使用 */
  raw?: SelectOptionData;
}

export const selectProps = {
  /**
   * @zh-CN 选择框的值 v-model
   * @en-US Select the value of the box.
   */
  modelValue: {
    type: [String, Number, Array] as PropType<SelectValueT>,
  },
  /**
   * @zh-CN 选择框的默认值，非受控
   * @en-US The default value of the selection box is uncontrolled.
   */
  defaultValue: {
    type: [String, Number, Array] as PropType<SelectValueT>,
  },
  /**
   * @zh-CN 选择框大小
   * @en-US Select box size.
   */
  size: {
    type: String as PropType<SizeT>,
  },
  /**
   * @zh-CN 选择框圆角
   * @en-US Select the rounded corners of the box
   */
  round: {
    type: String as PropType<RoundT>,
  },
  /**
   * @zh-CN 选择框颜色
   * @en-US Select box color.
   * @default 'normal'
   */
  color: {
    type: String as PropType<Color2T>,
    default: 'normal',
  },
  /**
   * @zh-CN 选择框变体
   * @en-US Selection box variant.
   * @default 'outline'
   */
  variant: {
    type: String as PropType<VariantT>,
    default: 'outline',
  },
  /**
   * @zh-CN 选择框提示文本
   * @en-US Select box prompt text.
   */
  placeholder: {
    type: String,
  },
  /**
   * @zh-CN 支持多选
   * @en-US Support multiple selections.
   */
  multiple: {
    type: Boolean,
  },
  /**
   * @zh-CN 多选标签最大显示数量，支持数字或 'responsive' 容器宽度自适应
   * @en-US Maximum display quantity of multiple selection tags, supports number or 'responsive' for container width adaptation
   */
  maxTagCount: {
    type: [Number, String] as PropType<number | 'responsive'>,
  },
  /**
   * @zh-CN 支持快速清除
   * @en-US Support quick clearing.
   */
  clearable: {
    type: Boolean as PropType<boolean | undefined>,
    default: undefined,
  },
  /**
   * @zh-CN 支持禁用
   * @en-US Support disabling.
   */
  disabled: {
    type: Boolean as PropType<boolean | undefined>,
    default: undefined,
  },
  /**
   * @zh-CN 选项触发方式
   * @en-US Option trigger method.
   * @default 'click'
   */
  trigger: {
    type: String as PropType<PopupTriggerT>,
    default: 'click',
  },
  /**
   * @zh-CN 选项布局位置
   * @en-US Option layout location.
   * @default 'bl'
   */
  optionPosition: {
    type: String as PropType<PopupPositionT>,
    default: 'bl',
  },
  /**
   * @zh-CN 选项宽度自适应规则
   * 'auto': 自动
   * 'min-width': 最小宽度与选择框一致
   * 'width': 宽度与选择框一致
   * @en-US Option width adaptive rule.
   * 'auto': auto
   * 'min-width': The minimum width is consistent with the selection box.
   * 'width': The width is consistent with the selection box.
   * @default 'min-width'
   */
  optionWidthMode: {
    type: String as PropType<OptionWidthModeT>,
    default: 'min-width',
  },
  /**
   * @zh-CN 选项容器自定义类
   * @en-US Option container custom class.
   */
  optionWrapClass: {
    type: [String, Array, Object] as PropType<string | { [k: string]: boolean } | Array<{ [k: string]: boolean } | string>>,
  },
  /**
   * @zh-CN 是否在结束选择时，卸载所有选项，v-model
   * @en-US Whether to uninstall all options when ending the selection.
   * @default true
   */
  unmountOnHide: {
    type: Boolean,
    default: true,
  },
  /**
   * @zh-CN 过渡名称
   * @en-US Transition name.
   */
  transition: {
    type: String,
  },
  /**
   * @zh-CN 加载中
   * @en-US loading.
   */
  loading: {
    type: Boolean,
  },
  /**
   * @zh-CN 选择前回调，根据返回值判断是否显示
   * @en-US Select the pre-callback and determine whether to display based on the return value.
   */
  beforeSelect: {
    type: Function as PropType<(value: string | number, currentValue: SelectValueT) => Promise<boolean | string | number> | boolean | string | number>,
  },
  /**
   * @zh-CN 显示前回调，根据返回值判断是否显示
   * @en-US Display the callback before display, and determine whether to display based on the return value.
   */
  beforeOptionsShow: {
    type: Function as PropType<() => Promise<boolean> | boolean>,
  },
  /**
   * @zh-CN 隐藏前回调，根据返回值判断是否隐藏
   * @en-US Hide the previous callback and determine whether to hide it based on the return value.
   */
  beforeOptionsHide: {
    type: Function as PropType<() => Promise<boolean> | boolean>,
  },
  /**
   * @zh-CN 选项挂载容器，默认为body
   * @en-US The option mounts the container, with the default being body.
   * @default 'body'
   */
  optionsWrapper: {
    type: [String, Object] as PropType<string | HTMLElement | null>,
    default: 'body',
  },
  /**
   * @zh-CN 多选超过最大tag时，以文本显示
   * @en-US When multiple selections exceed the maximum tag, they will be displayed as text.
   */
  foldLabel: {
    type: Function as PropType<(tags: Array<SelectOptionT>) => string>,
  },
  /**
   * @zh-CN 浮层显示收起的多选tag
   * @en-US The floating layer shows the multiple selected tags that have been folded.
   * @default 'hover'
   */
  showFoldTags: {
    type: [Boolean, String] as PropType<boolean | 'hover' | 'click'>,
    default: 'hover',
  },
  /**
   * @zh-CN 选项标题（pad、phone显示）
   * @en-US Option title (displayed on pad and phone).
   */
  optionTitle: {
    type: String,
  },
  /**
   * @zh-CN 支持选项浮层响应式
   * @en-US Support option floating layer responsiveness.
   */
  noResponsive: {
    type: Boolean,
  },
  /**
   * @zh-CN 数据驱动模式的选项数据数组，支持扁平选项与 `{ type: 'group', children }` 分组结构
   * @en-US Option data array for data-driven mode, supports flat options and `{ type: 'group', children }` group structure
   * @since NEXT
   */
  options: {
    type: Array as PropType<SelectMixedOption[]>,
    default: undefined,
  },
  /**
   * @zh-CN 自定义选项数据字段名，仅在 options 模式下生效，插槽模式不介入
   * @en-US Custom field names for option data, only effective in options mode, not in slot mode
   * @since NEXT
   */
  fieldNames: {
    type: Object as PropType<SelectFieldNames>,
    default: undefined,
  },
  /**
   * @zh-CN 开启搜索/过滤能力，开启后 input 可编辑。多选有 tag 时，主输入框（`.o-select-input`）不渲染，改为在 tag 区域内联渲染搜索 input（`.o-select-input--tag`），两者互斥，请勿依赖固定的 input DOM 位置
   * @en-US Enable search/filter capability, input becomes editable when enabled. In multiple mode with tags, the main input (`.o-select-input`) is not rendered; instead an inline search input (`.o-select-input--tag`) is rendered inside the tag area — the two are mutually exclusive, do not rely on a fixed input DOM position
   * @since NEXT
   */
  filterable: {
    type: Boolean,
    default: false,
  },
  /**
   * @zh-CN 过滤函数，true 为内置默认过滤（label 包含匹配，不区分大小写），false 为不过滤（远程搜索），也可传入自定义函数
   * @en-US Filter function, true for built-in default filter (label includes match, case-insensitive), false for no filter (remote search), or custom function
   * @since NEXT
   */
  filterOption: {
    type: [Boolean, Function] as PropType<boolean | ((inputValue: string, option: SelectOptionData) => boolean)>,
    default: true,
  },
  /**
   * @zh-CN 完全自定义过滤方法，优先级高于 filterOption
   * @en-US Fully custom filter method, takes precedence over filterOption
   * @since NEXT
   */
  filterMethod: {
    type: Function as PropType<(query: string) => void>,
    default: undefined,
  },
  /**
   * @zh-CN 受控搜索词，配合 update:inputValue 事件使用
   * @en-US Controlled search query, used with update:inputValue event
   * @since NEXT
   */
  inputValue: {
    type: String,
    default: undefined,
  },
  /**
   * @zh-CN 关闭下拉时是否保留搜索词，默认 false 清空
   * @en-US Whether to retain search query when closing dropdown, default false to clear
   * @since NEXT
   */
  retainInputValue: {
    type: Boolean,
    default: false,
  },
  /**
   * @zh-CN 开启创建新选项能力，输入不存在的值时下拉首项显示「创建 xxx」
   * @en-US Enable create new option, shows "Create xxx" as first item when input value doesn't exist
   * @since NEXT
   */
  allowCreate: {
    type: Boolean,
    default: false,
  },
  /**
   * @zh-CN 创建项的显示文案生成函数，不传时走 i18n 默认文案
   * @en-US Label generator for create option, uses i18n default when not provided
   * @since NEXT
   */
  createLabel: {
    type: Function as PropType<(input: string) => string>,
    default: undefined,
  },
  /**
   * @zh-CN 多选模式下自动开启 tags 创建行为（默认 false 不自动开启）
   * @en-US Auto-enable tags creation in multiple mode (default false)
   * @since NEXT
   */
  autoTagInMultiple: {
    type: Boolean,
    default: false,
  },
  /**
   * @zh-CN 开启虚拟滚动，大数据量时只渲染可见项
   * @en-US Enable virtual scrolling, only render visible items for large data
   * @since NEXT
   */
  virtual: {
    type: Boolean,
    default: false,
  },
  /**
   * @zh-CN 虚拟列表配置项，透传到 OVirtualList（如 itemSize、buffer 等）
   * @en-US Virtual list props, forwarded to OVirtualList (e.g. itemSize, buffer)
   * @since NEXT
   */
  virtualListProps: {
    type: Object as PropType<Partial<typeof virtualListProps>>,
    default: undefined,
  },
  /**
   * @zh-CN 多选数量上限，0 表示无限制，达到上限后未选项变 disabled
   * @en-US Multiple selection limit, 0 means unlimited, unselected options become disabled when limit is reached
   * @since NEXT
   */
  limit: {
    type: Number,
    default: 0,
  },
  /**
   * @zh-CN 值不在选项列表时的兜底显示，false 不显示，函数返回完整 option 对象
   * @en-US Fallback display when value not in options, false to not show, function returns full option object
   * @since NEXT
   */
  fallbackOption: {
    type: [Boolean, Function] as PropType<false | ((value: string | number) => SelectOptionData)>,
    default: false,
  },
  /**
   * @zh-CN 搜索结果排序函数，仅在搜索结果非空时生效
   * @en-US Sort function for search results, only effective when results are non-empty
   * @since NEXT
   */
  filterSort: {
    type: Function as PropType<(optionA: SelectOptionData, optionB: SelectOptionData) => number>,
    default: undefined,
  },
  /**
   * @zh-CN 分词符数组，输入或粘贴含分隔符时拆分为多个值，仅 multiple + allowCreate 模式生效
   * @en-US Token separators array, split input/paste into multiple values, only in multiple + allowCreate mode
   * @since NEXT
   */
  tokenSeparators: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
  /**
   * @zh-CN 自定义选项 label 渲染函数，与 `#option-label` 插槽同时存在时插槽优先
   * @en-US Custom option label render function, `#option-label` slot takes precedence when both exist
   * @since NEXT
   */
  renderLabel: {
    type: Function as PropType<(option: SelectOptionData, selected: boolean) => VNodeChild>,
    default: undefined,
  },
  /**
   * @zh-CN 自定义多选 tag 渲染函数
   * @en-US Custom tag render function for multiple mode
   * @since NEXT
   */
  renderTag: {
    type: Function as PropType<(option: SelectOptionData, onClose: () => void) => VNodeChild>,
    default: undefined,
  },
  /**
   * @zh-CN 表单字段名，透传到隐藏 input/select 供表单提交
   * @en-US Form field name, forwarded to hidden input/select for form submission
   * @since NEXT
   */
  name: {
    type: String,
    default: undefined,
  },
  /**
   * @zh-CN Schema.org itemprop 属性，透传到隐藏 input/select 供结构化数据
   * @en-US Schema.org itemprop attribute, forwarded to hidden input/select for structured data
   * @since NEXT
   */
  itemprop: {
    type: String,
    default: undefined,
  },
};

export type SelectPropsT = ExtractPropTypes<typeof selectProps>;
