import { ExtractPropTypes, PropType } from 'vue';

const pageSizes = [6, 12, 24, 48];

export const paginationProps = {
  /**
   * 支持选择的每页数据条数
   */
  pageSizes: {
    type: Array as PropType<number[]>,
    default: () => pageSizes
  },
  /**
   * 每页数据条数
   */
  pageSize: {
    type: Number,
    default: pageSizes[0]
  },
  /**
   * 数据总条数
   */
  total: {
    type: Number,
    default: 0
  },
  /**
   * 当前页码
   */
  page: {
    type: Number,
    default: 1
  },
  /**
   * 显示页面数 > 3
   */
  showPageCount: {
    type: Number,
    default: 9
  },
  /**
   * 显示页面数 > 3
   */
  showJumper: {
    type: Boolean
  },
  /**
   * 简洁模式
   */
  simple: {
    type: Boolean
  },
};

export type PaginationPropsT = ExtractPropTypes<typeof paginationProps>;