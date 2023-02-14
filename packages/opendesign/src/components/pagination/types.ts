export interface PaginationPropT {
  /**
   * 数据总条数
   */
  total?: number;
  /**
   * 当前页码
   */
  currentPage?: number;
  /**
   * 每页数据条数
   */
  pageSize?: number;
  /**
   * 支持选择的每页数据条数
   */
  pageSizes?: number[];
  /**
   * 显示页面数 > 3
   */
  showPageCount?: number;
  /**
   * 简洁模式
   */
  simple?: boolean;
}

export const defaultPageSizes = [6, 12, 24, 48];