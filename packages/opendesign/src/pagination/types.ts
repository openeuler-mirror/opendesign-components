import { ExtractPropTypes, PropType } from 'vue';
import { RoundT } from '../_utils/types';

const pageSizes = [6, 12, 24, 48];

export const PaginationVariantTypes = ['solid', 'outline'] as const;
export type PaginationVariantT = (typeof PaginationVariantTypes)[number];

export const PaginationLayoutTypes = ['total', 'pagesize', 'pager', 'jumper'] as const;
export type PaginationLayoutT = Array<(typeof PaginationLayoutTypes)[number]>;

export const paginationProps = {
  /**
   * @zh-CN 布局(包含哪些控件)
   * @en-US Layout (which controls to include)
   * @default ['pagesize', 'pager', 'jumper']
   */
  layout: {
    type: Array as PropType<PaginationLayoutT>,
    default: ['pagesize', 'pager', 'jumper'],
  },
  /**
   * @zh-CN 按钮形状
   * @en-US Button variant
   * @default 'outline'
   */
  variant: {
    type: String as PropType<PaginationVariantT>,
    default: 'outline',
  },
  /**
   * @zh-CN 圆角值
   * @en-US Button round
   */
  round: {
    type: String as PropType<RoundT>,
  },
  /**
   * @zh-CN 每页数据条数的选项
   * @en-US Page size options
   * @default [6, 12, 24, 48]
   */
  pageSizes: {
    type: Array as PropType<number[]>,
    default: () => pageSizes,
  },
  /**
   * @zh-CN 每页数据条数 v-model
   * @en-US Page size v-model
   * @default 6
   */
  pageSize: {
    type: Number,
    default: pageSizes[0],
  },
  /**
   * @zh-CN 数据总条数
   * @en-US Total number of data
   * @default 0
   */
  total: {
    type: Number,
    default: 0,
  },
  /**
   * @zh-CN 当前页码 v-model
   * @en-US Current page v-model
   * @default 1
   */
  page: {
    type: Number,
    default: 1,
  },
  /**
   * @zh-CN 最多显示的页码按钮数
   * @en-US Maximum number of page buttons to display
   * @default 9
   */
  showPageCount: {
    type: Number,
    default: 9,
  },
  /**
   * @zh-CN 中间页码被隐藏时，是否启用hover显示所有页码功能
   * @en-US Whether to enable the hover-to-display-all-page-numbers function when the middle page numbers are hidden.
   * @default true
   */
  showMore: {
    type: Boolean,
    default: true,
  },
  /**
   * @zh-CN 是否显示总数据量
   * @en-US Whether to display the total number of data items.
   * @deprecated Please configure the total property in the layout property.
   */
  showTotal: {
    type: Boolean,
  },
  /**
   * @zh-CN 是否使用简洁布局
   * @en-US Whether to use the simple layout
   */
  simple: {
    type: Boolean,
  },
};

export type PaginationPropsT = ExtractPropTypes<typeof paginationProps>;
