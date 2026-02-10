import { Component, ExtractPropTypes, PropType, VNode } from 'vue';

import { tableProps, TableRowT } from '../table';

export const DataTableSizes = ['medium', 'small'] as const;
export type DataTableSizeT = (typeof DataTableSizes)[number];

export const DataTableFixedTypes = [true, 'left', 'right'] as const; // true as 'left'
export type DataTableFixedT = (typeof DataTableFixedTypes)[number];

/**
 * 被选项通用类型
 * @template TLabel - label字段的类型，默认any
 * @template TValue - value字段的类型，默认any
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

/** 筛选条件为“空”时的值 */
export const TABLE_EMPTY_OPTION_VALUE = '__null__' as const;
/** 筛选条件为单选时，筛选条件为“全选”时的值 */
export const TABLE_ALL_OPTION_VALUE = '__all__' as const;

/**
 * 获取筛选项数组的方法，支持异步返回
 * @param {EffectiveDataTableColumnT} option.column 当前列的配置
 * @param {DataTableColumnFilterOption} option.emptyOption 空值选项，根据需求采用
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
 */
export type DataTableColumnFormatter = (options: DataTableColumnFormatterOptions) => Component | VNode | string;

/**
 * 合并单元格的计算方法
 */
export type DataTableSpanMethod = (options: DataTableColumnFormatterOptions) => { colSpan?: number; rowSpan?: number } | void;

export type DataTableColumnFilterT = {
  /**
   * 获取筛选可选项的方法
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
 * 列的配置文件
 */
export interface DataTableColumnT {
  key: string;
  label?: string | Component | VNode;
  formatter?: DataTableColumnFormatter;
  fixed?: DataTableFixedT;
  /** 列的宽度，设置了fixed时必填 */
  width?: number | string;
  /** 列的最小宽度 */
  minWidth?: number | string;
  /** 列的最大宽度 */
  maxWidth?: number | string;
  /**
   * 是否显示溢出隐藏气泡
   */
  showOverflowToolTip?: boolean;
  /**
   * 排序方式绑定的条件对象的key
   * @important 只能进行单一列的排序，当前列排序修改后会清空其他列的排序
   */
  sortKey?: string;
  /**
   * 列表头筛选配置
   */
  filter?: DataTableColumnFilterT;
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
    type: String,
    default: 'id',
  },
  /**
   * @zh-CN 合并单元格的计算方法，已被合并的单元格不会再次被合并
   * @en-US Calculation Methods for Merged Cells​. Cells that have already been merged cannot be merged again
   */
  spanMethod: {
    type: Function as PropType<DataTableSpanMethod>,
    default: () => () => undefined,
  },
  /**
   * @zh-CN 表格是否可以调整列宽
   * @en-US Resize column width
   */
  columnResizable: {
    type: Boolean,
    default: false,
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
export type DataTableConditionValue = string | number | boolean;
export type DataTableConditionUpdatePayload<T = DataTableConditionValue> = {
  /** 对应column的key */
  key: string;
  /** 选中的值，由于是多选，所以是数组类型 */
  newVal: T[];
};

export const DataTableSortMethod = {
  /** 升序排序 */
  ASC: 1,
  /** 降序排序 */
  DESC: -1,
  /** 不排序 */
  NA: undefined,
} as const;
export type DataTableSortMethodT = (typeof DataTableSortMethod)[keyof typeof DataTableSortMethod];
export type DataTableSortUpdatePayload = {
  /** 对应column的key */
  key: string;
  newVal?: DataTableSortMethodT;
};

/** 单行数据选中、取消事件传参 */
export type DataTableSelectionPayload = {
  /** 对应行数据的rowKey对应的值 */
  key: DataTableRowKeyValue;
  /** 是否被选中 */
  selected: boolean;
};

export type DataTableSelectionChangePayload = {
  /** 改变前对应行数据的rowKey对应的值 */
  prev: DataTableRowKeyValue[];
  /** 改变后对应行数据的rowKey对应的值 */
  cur: DataTableRowKeyValue[];
};
