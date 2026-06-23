import { Component, ExtractPropTypes, PropType, Ref, VNode } from 'vue';

import { tableProps, TableRowT } from '../table';

export const DataTableSizes = ['medium', 'small'] as const;
export type DataTableSizeT = (typeof DataTableSizes)[number];

/**
 * 表头风格类型
 * @since 1.2.2
 */
export const DataTableHeaderStyles = ['fill', 'split-line'] as const;
export type DataTableHeaderStyleT = (typeof DataTableHeaderStyles)[number];

/**
 * 排序模式类型
 * - single: 单条件排序，点击排序时清空其他列的排序
 * - multiple: 多条件排序，支持同时按多列排序，通过 sortSequence 维护排序条件的操作序列，
 *             序列仅记录操作先后，优先级由调用者自行解读
 * @since NEXT
 */
export const DataTableSortModes = ['single', 'multiple'] as const;
export type DataTableSortModeT = (typeof DataTableSortModes)[number];

export const DataTableFixedTypes = [true, 'left', 'right'] as const; // true as 'left'
export type DataTableFixedT = (typeof DataTableFixedTypes)[number];

/**
 * 被选项通用类型
 * @template TLabel - label字段的类型，默认any
 * @template TValue - value字段的类型，默认any
 * @since 1.2.2
 */
export interface DataTableColumnFilterOption<TLabel = any, TValue = any> {
  /**
   * 标签文本，用于渲染
   */
  label: TLabel;
  /**
   * 选项值
   */
  value: TValue;
  [key: string]: any;
}

/**
 * 筛选条件为“空”时的值
 * @since 1.2.2
 */
export const TABLE_EMPTY_OPTION_VALUE = '__null__' as const;
/**
 * 筛选条件为单选时，筛选条件为“全选”时的值
 * @since 1.2.2
 */
export const TABLE_ALL_OPTION_VALUE = '__all__' as const;

/**
 * 获取筛选项数组的方法，支持异步返回
 * @param {EffectiveDataTableColumnT} option.column 当前列的配置
 * @param {DataTableColumnFilterOption} option.emptyOption 空值选项，根据需求采用
 * @since 1.2.2
 */
export type DataTableColumnFilterOptionsFn<TLabel = any, TValue = any> = (option: {
  column: EffectiveDataTableColumnT;
  emptyOption: { label: string; value: typeof TABLE_EMPTY_OPTION_VALUE };
}) => DataTableColumnFilterOption<TLabel, TValue>[] | Promise<DataTableColumnFilterOption<TLabel, TValue>[]>;

/**
 * 单元格渲染方法入参
 */
export interface DataTableColumnFormatterOptions {
  /**
   * 当前行的数据
   */
  row: any;
  /**
   * 当前列的配置
   */
  column: EffectiveDataTableColumnT;
  /**
   * 单元格默认的渲染值
   */
  cellValue: string | number | unknown;
  /**
   * 当前行的索引
   */
  rowIndex: number;
  /**
   * 当前列的索引
   */
  colIndex: number;
}
/**
 * 单元格的渲染方法
 * @returns 可返回 string（纯文本）、VNode（h 函数创建）、Component（defineComponent 创建）、
 *          或函数式组件 `() => VNode`（推荐用于 JSX/TSX 场景）
 */
export type DataTableColumnFormatter = (options: DataTableColumnFormatterOptions) => Component | VNode | string;

/**
 * 表格行级共享插槽类型
 * @description ODataTable 与 TableRow 共用的行级插槽，包括行展开插槽和单元格自定义插槽（td_ 前缀）
 */
export type DataTableRowSlots = {
  /** 行展开插槽 */
  expand?: (scope: { row: TableRowT; rowIndex: number }) => any;
} & Record<`td_${string}`, (options: { column: EffectiveDataTableColumnT; row: TableRowT; cellValue: any; index: number }) => any>;

/**
 * 合并单元格的计算方法
 * @since 1.2.2
 */
export type DataTableSpanMethod = (options: DataTableColumnFormatterOptions) => { colSpan?: number; rowSpan?: number } | void;

/**
 * 行展开的计算方法，返回 false 则不可被展开
 * @returns 可返回 Component、VNode、string、或函数式组件 `() => VNode`（推荐 JSX/TSX 场景）；
 *          返回 false 表示该行不可展开
 * @since 1.2.2
 */
export type DataTableExpandMethod = (row: any, rowIndex: number) => Component | VNode | string | false;

/**
 * 列筛选配置类型
 * @since 1.2.2
 */
export type DataTableColumnFilterT = {
  /**
   * 获取筛选可选项的方法，支持异步返回
   * @param option.column 当前列的配置
   * @param option.emptyOption 内置的"空值"选项，可直接放入返回数组以支持筛选空值数据
   * @since 1.2.2
   */
  optionsFn: DataTableColumnFilterOptionsFn;
  /**
   * 移动端弹窗的title
   */
  optionTitle?: string;
  /**
   * 是否支持多选
   * @default true
   */
  multiple?: boolean;
  /**
   * 是否显示选项筛选输入框
   * @default (optionsCount) => optionsCount > 8
   */
  showInput?: boolean | ((optionsCount: number) => boolean);
};

/**
 * 列的配置
 */
export interface DataTableColumnT {
  /**
   * 列的数据字段名，对应行数据对象的 key
   */
  key: string;
  /**
   * 列表头文本，可传入字符串、VNode 或 Component 来自定义表头渲染
   */
  label?: string | Component | VNode;
  /**
   * 列表头的描述文案，会以气泡的形式展示在表头旁
   * @since 1.2.2
   */
  description?: string | Component | VNode;
  /**
   * 单元格渲染方法，可返回 string、VNode、Component 或函数式组件 `() => VNode`
   */
  formatter?: DataTableColumnFormatter;
  /**
   * 列固定方向，true 等同 'left'
   * @important IOS 端不支持多列固定
   */
  fixed?: DataTableFixedT;
  /**
   * 是否是作为竖向表头列
   * @default false
   * @since 1.2.2
   */
  asHeader?: boolean;
  /** 列的宽度 */
  width?: number | string;
  /** 列的最小宽度 */
  minWidth?: number | string;
  /** 列的最大宽度 */
  maxWidth?: number | string;
  /**
   * 表头是否显示溢出隐藏气泡，传入数字以设置最大行数
   * @default 1
   * @since 1.2.2
   */
  showHeaderOverflowToolTip?: boolean | number;
  /**
   * 表体是否显示溢出隐藏气泡，传入数字以设置最大行数
   * @default false
   * @since 1.2.2
   */
  showOverflowToolTip?: boolean | number;
  /**
   * 排序方式绑定的条件对象的key
   * @important sortMode 为 single 时为单条件排序，当前列排序修改后会清空其他列的排序；
   *            sortMode 为 multiple 时为多条件排序，通过 sortSequence 维护排序条件的操作序列
   * @since 1.2.2
   */
  sortKey?: string;
  /**
   * 列表头筛选配置
   * @since 1.2.2
   */
  filter?: DataTableColumnFilterT;
  /**
   * 表头单元格的自定义colspan
   * @important 仅支持同层级兄弟单元格之间的合并
   * @since 1.2.2
   */
  customColSpan?: number;
  /**
   * 嵌套表头配置
   */
  children?: DataTableColumnT[];
}

export type EffectiveDataTableColumnCommonT = {
  formatter: DataTableColumnFormatter;
  colSpan?: number;
  rowSpan?: number;
  /** 列宽调整后的宽度，用于计算固定列的定位值 */
  resizeWidth?: number;
  /** 列的最小宽度 - 通过容器宽度计算后 */
  _minWidth?: number;
  /** 列的最大宽度 - 通过容器宽度计算后 */
  _maxWidth?: number;
  fixed?: 'left' | 'right';
  /** fix为undefined或left时当前列的left值 */
  left?: number;
  /** fix为right时当前列的right值 */
  right?: number;
  /** 是否是最后一个左固定列，用于控制表头样式 */
  isLastLeftFixedCol?: boolean;
  /** 是否是第一个右固定列，用于控制表头样式 */
  isFirstRightFixedCol?: boolean;
  /** 是否是最左边的列 */
  isFirstCol?: boolean;
  /** 是否是最右边的列 */
  isLastCol?: boolean;
  /** 表头是否由于自定义表头单元格合并而被合并后，不渲染 */
  headerHidden?: boolean;
  colRef?: HTMLTableColElement;
  thRef?: HTMLTableCellElement;
  /**
   * 嵌套表头配置
   */
  children?: EffectiveDataTableColumnT[];
  parent?: EffectiveDataTableColumnT;
};

export type EffectiveDataTableColumnT = DataTableColumnT & EffectiveDataTableColumnCommonT;

const { emptyLabel, loading, loadingLabel, border, stripe, highlightCurrentRow } = tableProps;

export const dataTableProps = {
  /**
   * @zh-CN 表格数据
   * @en-US Table data
   */
  data: {
    type: Array as PropType<TableRowT[]>,
    required: true,
  },
  /**
   * @zh-CN 列配置, IOS端不支持多列固定
   * @en-US Table column schema， not support multi-column fixed in IOS
   */
  columns: {
    type: Array as PropType<DataTableColumnT[]>,
    required: true,
  },
  /**
   * @zh-CN 表格尺寸
   * @en-US table size
   */
  size: {
    type: String as PropType<DataTableSizeT>,
    default: 'medium',
  },
  /**
   * @zh-CN 表格高度，超出时固定表头滚动
   * @en-US Table Height: Fixed Header with Scrollable Body When Exceeding Height
   */
  height: {
    type: [Number, String] as PropType<number | string>,
  },
  /**
   * @zh-CN 表格最大高度，超出时固定表头滚动
   * @en-US Table Max Height: Fixed Header with Scrollable Body When Exceeding Height
   */
  maxHeight: {
    type: [Number, String] as PropType<number | string>,
    default: 'fit-content',
  },
  /**
   * @zh-CN 内部table元素最小宽度，超出时出现横向滚动条
   * @en-US min-width of the inner table element; a horizontal scrollbar will appear when it exceeds the available width.
   */
  minTableWidth: {
    type: [Number, String] as PropType<number | string>,
  },
  /**
   * @zh-CN 表格数据行唯一标识字段名
   * @en-US Unique Identifier Field Name for Table Data Rows
   */
  rowKey: {
    type: [String, Function] as PropType<string | ((row: TableRowT) => string)>,
    default: 'id',
  },
  /**
   * @zh-CN 合并单元格的计算方法，已被合并的单元格不会再次被合并
   * @en-US Calculation Methods for Merged Cells. Cells that have already been merged cannot be merged again
   */
  spanMethod: {
    type: Function as PropType<DataTableSpanMethod>,
    default: () => () => undefined,
  },
  /**
   * @zh-CN 是否展示header
   * @en-US Whether to show the header.
   * @since 1.2.2
   */
  showHeader: {
    type: Boolean,
    default: true,
  },
  /**
   * @zh-CN 表头风格
   * @en-US table header style
   * @since 1.2.2
   */
  headerStyle: {
    type: String as PropType<DataTableHeaderStyleT>,
    default: 'fill',
  },
  /**
   * @zh-CN 排序模式，single 为单条件排序，multiple 为多条件排序
   * @en-US Sort mode, 'single' for single-condition sort, 'multiple' for multi-condition sort
   * @since NEXT
   */
  sortMode: {
    type: String as PropType<DataTableSortModeT>,
    default: 'single',
  },
  /**
   * @zh-CN 行展开的计算方法，返回 `false` 则不可被展开
   * @en-US Calculation Methods for Row expansion. Returns `false` if the row cannot be expanded.
   * @since 1.2.2
   */
  expandMethod: {
    type: Function as PropType<DataTableExpandMethod>,
  },
  /**
   * @zh-CN 表格是否可以调整列宽
   * @en-US Resize column width
   */
  columnResizable: {
    type: Boolean,
    default: false,
  },
  /**
   * @zh-CN 表格是否可以行选择
   * @en-US Whether row selection is available for the table.
   * @since 1.2.2
   */
  selection: {
    type: Boolean,
    default: false,
  },
  /**
   * @zh-CN 选择时指示行是否可被选择的键名
   * @en-US Key name for indicating row selectability during selection
   * @since 1.2.2
   */
  disabledProp: {
    type: String,
    default: 'disabled',
  },
  /**
   * @zh-CN 树形表格选择时是否遵循父子不关联
   * @en-US Whether to disable parent-child association in tree table selection
   * @since 1.2.2
   */
  checkStrictly: {
    type: Boolean,
    default: true,
  },
  stripe,
  border,
  /**
   * @zh-CN 单元格为空时的展示文案，默认为 '--'
   * @en-US Render text when cell value is empty
   */
  defaultEmptyCellText: {
    type: String,
    default: '--',
  },
  emptyLabel,
  loading,
  loadingLabel,
  highlightCurrentRow,
} as const;

export type DataTablePropsT = ExtractPropTypes<typeof dataTableProps>;

/** rowKey对应的值的可能类型 */
export type DataTableRowKeyValue = string | number;
/**
 * 筛选条件值类型
 * @since 1.2.2
 */
export type DataTableConditionValue = string | number | boolean;
/**
 * 筛选条件更新事件传参
 * @since 1.2.2
 */
export type DataTableConditionUpdatePayload<T = DataTableConditionValue> = {
  /** 对应column的key */
  key: string;
  /** 选中的值，由于是多选，所以是数组类型 */
  newVal: T[];
};

/**
 * 排序方式常量
 * - ASC (1): 升序排序
 * - DESC (-1): 降序排序
 * - NA (undefined): 不排序，用于初始化 conditions 中的排序字段
 * @since 1.2.2
 */
export const DataTableSortMethod = {
  /** 升序排序 */
  ASC: 1,
  /** 降序排序 */
  DESC: -1,
  /** 不排序 */
  NA: undefined,
} as const;
export type DataTableSortMethodT = (typeof DataTableSortMethod)[keyof typeof DataTableSortMethod];
/**
 * 排序更新事件传参
 * @since 1.2.2
 */
export type DataTableSortUpdatePayload = {
  /** 对应column的sortKey */
  key: string;
  /** 排序方向 */
  newVal?: DataTableSortMethodT;
  /**
   * 排序条件的操作序列，详细说明见 sortSequence prop
   * @since NEXT
   */
  sortSequence: string[];
};

/**
 * 单行数据选中、取消事件传参
 * @since 1.2.2
 */
export type DataTableSelectionPayload = {
  /** 对应行数据的rowKey对应的值 */
  key: DataTableRowKeyValue;
  /** 是否被选中 */
  selected: boolean;
};

/**
 * 选中状态变更事件传参
 * @since 1.2.2
 */
export type DataTableSelectionChangePayload = {
  /** 改变前对应行数据的rowKey对应的值 */
  prev: DataTableRowKeyValue[];
  /** 改变后对应行数据的rowKey对应的值 */
  cur: DataTableRowKeyValue[];
};

export type DataTableExposed = {
  /** 计算当前行的rowKey的方法 */
  getRowKey: (row: TableRowT, rowIndex: number) => DataTableRowKeyValue;
  /** 所有列配置的基于key的map */
  dataColumnMap: Map<string, EffectiveDataTableColumnT>;
  /** 所有的列的扁平数组 */
  dataColumns: Ref<EffectiveDataTableColumnT[]>;
  /** 列根据层级关系构造的二维数组 */
  groupColumns: Ref<EffectiveDataTableColumnT[][]>;
  /** 全选 @since 1.2.2 */
  selectAll: () => void;
  /** 清空全选 @since 1.2.2 */
  clearAll: () => void;
  /** 展开全部 @since 1.2.2 */
  expandAll: () => void;
  /** 收起全部 @since 1.2.2 */
  foldAll: () => void;
};
