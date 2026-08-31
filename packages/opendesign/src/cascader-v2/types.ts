import { ExtractPropTypes, PropType } from 'vue';
import { PopupPositionT, PopupTriggerT } from '../popup';
import { cascaderProps } from '../cascader';
import { selectProps, type SelectOptionT, type OptionWidthModeT, type SelectValueT } from '../select';
import type { SizeT } from '../_utils/types';

/** 节点值类型 */
export type CascaderV2NodeValueT = string | number;

/** 从根节点到当前节点各级 value 组成的路径数组 */
export type CascaderV2NodePathT = Array<CascaderV2NodeValueT>;

/** 级联选择器绑定值，`emitPath` 为 true 时为路径数组，否则为叶子节点值 */
export type CascaderV2ValueT = CascaderV2NodeValueT | CascaderV2NodePathT;

/** 级联选择器选项数据结构，T 可扩展自定义字段 */
export type CascaderV2OptionT<T extends Record<string, any> = Record<string, any>> = T & {
  /** 选项唯一标识 */
  value: CascaderV2NodeValueT;
  /** 展示文本 */
  label?: string;
  /** 子选项列表，存在时可展开下一级 */
  children?: CascaderV2OptionT<T>[];
  /** 是否禁用 */
  disabled?: boolean;
  /** 是否为叶子节点，懒加载模式下设为 true 时不再触发加载 */
  leaf?: boolean;
};

/** 懒加载回调接收的节点信息 */
export type CascaderV2LazyNodeT<T extends CascaderV2OptionT = CascaderV2OptionT> = {
  /** 节点值，根节点时为 null */
  value: CascaderV2NodeValueT | null;
  /** 层级，根节点为 0 */
  level: number;
  /** 是否为叶子节点 */
  isLeaf: boolean;
  /** 原始选项数据，根节点时为 null */
  data: T | null;
  /** 从根到当前节点的值路径 */
  path: Array<CascaderV2NodeValueT>;
  /** 展示文本 */
  label: string;
};

const { modelValue } = cascaderProps;
const { round, color, variant, disabled, loading, clearable, multiple, placeholder } = selectProps;

/**
 * 懒加载数据的方法，加载成功调用 resolve，失败调用 reject，也可返回 Promise
 * */
export type CascaderV2LazyloadFn<T extends CascaderV2OptionT = CascaderV2OptionT> = (
  node: CascaderV2LazyNodeT<T>,
  resolve: (data: Array<T>) => void,
  reject: () => void,
) => void | Promise<Array<T>>;

/**
 * 选择前回调，用于在选中动作落地前进行拦截、确认或改写，支持同步返回或返回 Promise
 * @param value 用户当前操作想要选中的节点值
 * @param currentValue 选择器当前已选中的值（单选为单值，多选为值数组）
 * @returns
 *  - `true`：放行，按 `value` 正常选中
 *  - `false`：阻止本次选中
 *  - `string | number`：改写选中值，最终以该返回值作为新的选中项
 *  - `Promise<上述任一类型>`：异步场景（如需要先请求后端确认），resolve 后按对应规则处理
 */
export type CascaderV2BeforeSelectFn = (
  value: CascaderV2NodeValueT,
  currentValue: SelectValueT,
) => Promise<boolean | CascaderV2NodeValueT> | boolean | CascaderV2NodeValueT;

export const cascaderV2Props = {
  /**
   * @zh-CN 级联选择器选中值(v-model)
   * @en-US Cascader selected value (v-model)
   * @CascaderValueT string | number | Array<string | number>
   */
  modelValue,
  /**
   * @zh-CN 级联选择器选项值
   * @en-US Cascader option value
   * @CascaderOptionT { value: string | number, label?: string, children?: Array<CascaderOptionT> }
   */
  options: {
    type: Array as PropType<Array<CascaderV2OptionT>>,
  },
  /**
   * @zh-CN 选择框大小
   * @en-US Select box size.
   */
  size: {
    type: String as PropType<SizeT | undefined>,
    default: undefined,
  },
  /**
   * @zh-CN 选择框圆角
   * @en-US Select the rounded corners of the box
   */
  round,
  /**
   * @zh-CN 选择框颜色
   * @en-US Select box color.
   * @default 'normal'
   */
  color,
  /**
   * @zh-CN 选择框变体
   * @en-US Selection box variant.
   * @default 'outline'
   */
  variant,
  /**
   * @zh-CN 支持禁用
   * @en-US Support disabling.
   */
  disabled,
  /**
   * @zh-CN 加载中
   * @en-US loading.
   */
  loading,
  /**
   * @zh-CN 支持快速清除
   * @en-US Support quick clearing.
   */
  clearable,
  /**
   * @zh-CN 支持多选
   * @en-US Support multiple selections.
   */
  multiple,
  /**
   * @zh-CN 选择框提示文本
   * @en-US Select box prompt text.
   */
  placeholder,
  /**
   * @zh-CN 支持筛选
   * @en-US Whether to support filtering.
   */
  filterable: {
    type: Boolean,
  },
  /**
   * @zh-CN 多选标签最大显示数量
   * @en-US Maximum display quantity of multiple selection tags.
   */
  maxTagCount: {
    type: Number,
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
   * @zh-CN 选择前回调，根据返回值判断是否显示
   * @en-US Select the pre-callback and determine whether to display based on the return value.
   */
  beforeSelect: {
    type: Function as PropType<CascaderV2BeforeSelectFn>,
  },
  /**
   * @zh-CN 过渡名称
   * @en-US Transition name.
   */
  transition: {
    type: String,
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
   * @zh-CN 选项布局位置
   * @en-US Option layout location.
   * @default 'bl'
   */
  optionPosition: {
    type: String as PropType<PopupPositionT>,
    default: 'bl',
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
   * @zh-CN 选项触发方式
   * @en-US Option trigger method.
   * @default 'click-outclick'
   */
  trigger: {
    type: String as PropType<PopupTriggerT>,
    default: 'click-outclick',
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
    default: 'auto',
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
   * @zh-CN modelValue 是否使用路径模式
   * @en-US Whether to use path mode for modelValue
   * @default false
   */
  pathMode: {
    type: Boolean,
    default: false,
  },
  /**
   * @zh-CN 展开菜单选项的触发方式
   * @en-US Trigger method to expand menu options
   */
  expandTrigger: {
    type: String as PropType<'click' | 'hover'>,
    default: 'click',
  },
  /**
   * @zh-CN 输入框中是否显示完整的路径
   * @en-US Whether to display the complete path in the input box.
   * @default true
   */
  showAllLevels: {
    type: Boolean,
    default: true,
  },
  /**
   * @zh-CN 在选中节点改变时，是否返回由该节点所在的各级菜单的值所组成的数组，若设置 false，则只返回该节点的值
   * @en-US Whether to return an array composed of the values of each level menu where the node is located when the selected node changes. If set to false, only the value of the node is returned.
   * @default true
   */
  emitPath: {
    type: Boolean,
    default: true,
  },
  /**
   * @zh-CN 是否允许选中任意节点，父子节点勾选互不关联
   * @en-US Whether to allow selecting any node, parent and child nodes are checked independently.
   * @default false
   */
  allowSelectAnyNode: {
    type: Boolean,
    default: false,
  },
  /**
   * @zh-CN 是否动态加载子节点，需与 lazyLoad 方法结合使用
   * @en-US whether to dynamic load child nodes, use with lazyload attribute.
   * @default false
   * TODO: 当允许懒加载时，若搜索的值还没加载为节点，此时应该如何展示搜索结果
   */
  lazy: {
    type: Boolean,
    default: false,
  },
  /**
   * @zh-CN 加载动态数据的方法，仅在 lazy 为 true 时有效
   * @en-US method for loading child nodes data, only works when lazy is true.
   */
  lazyload: {
    type: Function as PropType<CascaderV2LazyloadFn>,
  },
};

export const cascaderV2PanelProps = {
  /**
   * @zh-CN 级联选择器选中值(v-model)
   * @en-US Cascader selected value (v-model)
   */
  modelValue: {
    type: [String, Number, Array] as PropType<CascaderV2ValueT>,
    default: '',
  },
  /**
   * @zh-CN 级联选择器选项值
   * @en-US Cascader option value
   */
  options: {
    type: Array as PropType<Array<CascaderV2OptionT>>,
  },
  /**
   * @zh-CN modelValue 是否使用路径模式
   * @en-US Whether to use path mode for modelValue
   * @default false
   */
  pathMode: {
    type: Boolean,
    default: false,
  },
  /**
   * @zh-CN 展开菜单选项的触发方式
   * @en-US Trigger method to expand menu options
   * @default false
   */
  expandTrigger: {
    type: String as PropType<'click' | 'hover'>,
    default: 'click',
  },
  /**
   * @zh-CN 下拉面板大小
   * @en-US Dropdown panel size.
   */
  size: {
    type: String as PropType<Exclude<SizeT, 'small'> | undefined>,
    default: undefined,
  },
  /**
   * @zh-CN 输入框中是否显示完整的路径
   * @en-US Whether to display the complete path in the input box.
   * @default true
   */
  showAllLevels: {
    type: Boolean,
    default: true,
  },
  /**
   * @zh-CN 支持筛选
   * @en-US Whether to support filtering.
   */
  filterable: {
    type: Boolean,
  },
  /**
   * @zh-CN 是否开启动态加载
   * @en-US Whether to enable dynamic loading.
   * @default false
   */
  lazy: {
    type: Boolean,
    default: false,
  },
  /**
   * @zh-CN 动态加载数据的方法，仅在 lazy 为 true 时有效
   * @en-US Method for dynamically loading data, only effective when lazy is true.
   */
  lazyload: {
    type: Function as PropType<CascaderV2LazyloadFn>,
  },
};

/** 由 cascaderV2Props 推导的 Props 类型 */
export type CascaderV2PropsT = ExtractPropTypes<typeof cascaderV2Props>;
