import { ExtractPropTypes, PropType } from 'vue';
import { RoundT } from '../_utils/types';

const pageSizes = [6, 12, 24, 48];

export const PaginationVariantTypes = ['solid', 'outline'] as const;
export type PaginationVariantT = (typeof PaginationVariantTypes)[number];

export const PaginationLayoutTypes = ['total', 'pagesize', 'pager', 'jumper'] as const;
export type PaginationLayoutT = Array<(typeof PaginationLayoutTypes)[number]>;

export const paginationProps = {
  /**
   * 布局：PaginationVariantT
   */
  layout: {
    type: Array as PropType<PaginationLayoutT>,
    default: ['pagesize', 'pager', 'jumper'],
  },
  /**
   * 按钮类型：PaginationVariantT
   */
  variant: {
    type: String as PropType<PaginationVariantT>,
    default: 'outline',
  },
  /**
   * 圆角值 RoundT
   */
  round: {
    type: String as PropType<RoundT>,
  },
  /**
   * 支持选择的每页数据条数
   */
  pageSizes: {
    type: Array as PropType<number[]>,
    default: () => pageSizes,
  },
  /**
   * 每页数据条数
   */
  pageSize: {
    type: Number,
    default: pageSizes[0],
  },
  /**
   * 数据总条数
   */
  total: {
    type: Number,
    default: 0,
  },
  /**
   * 当前页码
   */
  page: {
    type: Number,
    default: 1,
  },
  /**
   * 显示页面数 > 3
   */
  showPageCount: {
    type: Number,
    default: 9,
  },
  /**
   * 页码被隐藏时，hover显示所有页码
   */
  showMore: {
    type: Boolean,
    default: true,
  },
  /**
   * 显示总数据量
   */
  showTotal: {
    type: Boolean,
  },
  /**
   * 显示输入跳转
   */
  showJumper: {
    type: Boolean,
  },
  /**
   * 简洁模式
   */
  simple: {
    type: Boolean,
  },
};

export type PaginationPropsT = ExtractPropTypes<typeof paginationProps>;
