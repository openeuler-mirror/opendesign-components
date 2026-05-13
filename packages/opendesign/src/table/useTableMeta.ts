import { shallowRef, onBeforeUnmount, type MaybeRef } from 'vue';
import { resolveHtmlElement } from '../_utils/vue-utils';
import { debounce } from '../_utils/helper';
import { log } from '../_utils/log';

type CellT = {
  el: HTMLTableCellElement;
  // 包含
  colStart: number;
  rowStart: number;
  // 不包含
  colEnd: number;
  rowEnd: number;
  /** 该单元格是否为最后一列 */
  lastCol: boolean;
  /** 该单元格是否为最后一行 */
  lastRow: boolean;

  section: TableSection;
};
type TableSection = {
  data: (CellT | null)[][];
  totalCols: number;
  totalRows: number;
  rows: HTMLTableRowElement[];
  sectionEl: HTMLTableSectionElement;
  scope: 'head' | 'body' | 'foot';
};
type TableMetaOptions = {
  /** 通过 class 在 td 或 th 元素上标记是否为最后一行 */
  markCellLastRow?: boolean | string;
  /** 通过 class 在 td 或 th 元素上标记是否为最后一列 */
  markCellLastCol?: boolean | string;
  /** 通过 class 在 tr 元素上标记是否为最后一行 */
  markRowLast?: boolean | string;
  /** 最后一列的标记是否区分不同的 section */
  splitBySection?: boolean;
};

export const DEFAULT_CELL_FIRST_COL_MARKER = 'o-cell-first-col';
export const DEFAULT_CELL_LAST_COL_MARKER = 'o-cell-last-col';
export const DEFAULT_CELL_LAST_ROW_MARKER = 'o-cell-last-row';
export const DEFAULT_ROW_LAST_MARKER = 'o-row-last';

/**
 * 在 grid 数组的对应位置填充填充 cellMeta 数据，若单元格有合并则对应的多个单元格 rowspan * colspan 都会被填充
 * @param grid
 * @param cellMeta
 */
function fillGrid(grid: (CellT | null)[][], cellMeta: CellT) {
  for (let r = cellMeta.rowStart; r < cellMeta.rowEnd; r++) {
    if (!grid[r]) grid[r] = [];
    for (let c = cellMeta.colStart; c < cellMeta.colEnd; c++) {
      grid[r][c] = cellMeta;
    }
  }
}
// 处理表格数据
function processSection(section: HTMLTableSectionElement, scope: 'head' | 'body' | 'foot', cellMap: WeakMap<HTMLTableCellElement, CellT>): TableSection {
  const rows = section.rows;
  const grid: (CellT | null)[][] = [];
  const rtn: TableSection = {
    data: grid,
    totalRows: 0,
    totalCols: 0,
    rows: Array.from(rows),
    sectionEl: section,
    scope,
  };
  let maxCols = 0;

  // 初始化网格
  for (let i = 0; i < rows.length; i++) {
    grid.push([]);
  }

  // 放置所有单元格并计算最大列数
  for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
    const row = rows[rowIndex];
    let colIndex = 0;
    let colEnd = 0;

    for (const cell of Array.from(row.cells)) {
      const colspan = cell.colSpan || 1;
      const rowspan = cell.rowSpan || 1;
      while (grid[rowIndex][colIndex] !== undefined) {
        colIndex++;
      }

      colEnd = colIndex + colspan;
      // 创建单元格元数据
      const cellMeta: CellT = {
        el: cell,
        colStart: colIndex,
        rowStart: rowIndex,
        colEnd: colEnd,
        rowEnd: rowIndex + rowspan,
        lastCol: false,
        lastRow: false,
        section: rtn,
      };

      // 将单元格放入映射表
      cellMap.set(cell, cellMeta);

      // 在网格中占据单元格的位置
      fillGrid(grid, cellMeta);

      // 移动到下一个可用列位置
      colIndex += colspan;
    }
    if (colEnd > maxCols && rowIndex > 0) {
      log.warn(
        `The row ${rowIndex + 1} has ${colEnd} columns, exceeding previous row's ${maxCols} columns. This may indicate inconsistent cell count or incorrect colspan/rowspan settings.`,
        row,
      );
    }
    maxCols = Math.max(maxCols, colEnd);
  }
  rtn.totalCols = maxCols;
  rtn.totalRows = rows.length;
  return rtn;
}
// 标准化表格数据，使它们具有相同的列数
function normalizeSection(section: TableSection, maxCols: number) {
  // 扩展每行到最大列数
  section.data.forEach((row) => {
    if (row.length < maxCols) {
      row.push(...Array(maxCols - row.length).fill(null));
    }
  });
  section.totalCols = maxCols;
  return section;
}
function markCellEl(cell: CellT, colMarker: string | false | undefined, rowMarker: string | false | undefined) {
  if (colMarker) {
    if (cell.lastCol) {
      cell.el.classList.add(colMarker);
    } else {
      cell.el.classList.remove(colMarker);
    }
  }
  if (rowMarker) {
    if (cell.lastRow) {
      cell.el.classList.add(rowMarker);
    } else {
      cell.el.classList.remove(rowMarker);
    }
  }
}
function markSection(
  section: TableSection,
  isLastSection: boolean,
  marker: { cellColMarker?: string | false; cellRowMarker?: string | false; rowMarker?: string | false },
) {
  const { totalCols, totalRows, data } = section;
  for (let rowIndex = 0; rowIndex < totalRows; rowIndex++) {
    const isLastRow = rowIndex === totalRows - 1 && isLastSection;
    const rowEl = section.rows[rowIndex];
    if (marker.rowMarker && rowEl) {
      if (isLastRow) {
        rowEl.classList.add(marker.rowMarker);
      } else {
        rowEl.classList.remove(marker.rowMarker);
      }
    }
    for (let colIndex = 0; colIndex < totalCols; colIndex++) {
      const cell = data[rowIndex][colIndex];
      if (cell && rowIndex === cell.rowStart && colIndex === cell.colStart) {
        // 每个 cell 只处理一次
        if (cell.colEnd === totalCols) {
          cell.lastCol = true;
        }
        if (cell.rowEnd === totalRows && isLastSection) {
          cell.lastRow = true;
        }
        markCellEl(cell, marker.cellColMarker, marker.cellRowMarker);
      }
    }
  }
}
function markTable(sections: Array<TableSection | null>, options: TableMetaOptions) {
  const { markCellLastCol, markCellLastRow, markRowLast, splitBySection } = options;
  const marker = {
    cellColMarker: markCellLastCol === true ? DEFAULT_CELL_LAST_COL_MARKER : markCellLastCol,
    cellRowMarker: markCellLastRow === true ? DEFAULT_CELL_LAST_ROW_MARKER : markCellLastRow,
    rowMarker: markRowLast === true ? DEFAULT_ROW_LAST_MARKER : markRowLast,
  };

  const validSections = sections.filter(Boolean) as TableSection[];
  const lastSectionIdx = validSections.length - 1;
  validSections.forEach((section, sectionIndex) => {
    const isLastSection = splitBySection || sectionIndex === lastSectionIdx;
    markSection(section, isLastSection, marker);
  });
}
const processTable = (el: HTMLTableElement, cellMap: WeakMap<HTMLTableCellElement, CellT>, options: TableMetaOptions) => {
  let head = null;
  let foot = null;
  let maxCols = 0;
  // 处理表格数据
  if (el.tHead) {
    head = processSection(el.tHead, 'head', cellMap);
    maxCols = Math.max(maxCols, head.totalCols);
  }
  const bodies = Array.from(el.tBodies).map((tbody, index) => {
    const body = processSection(tbody, 'body', cellMap);
    if (body.totalCols > maxCols && maxCols > 0) {
      log.warn(
        `The tbody ${index + 1} has ${body.totalCols} columns, exceeding previous section's ${maxCols} columns. This may indicate inconsistent cell count or incorrect colspan/rowspan settings.`,
        tbody,
      );
    }
    maxCols = Math.max(maxCols, body.totalCols);
    return body;
  });
  if (el.tFoot) {
    foot = processSection(el.tFoot, 'foot', cellMap);
    if (foot.totalCols > maxCols && maxCols > 0) {
      log.warn(
        `The tfoot section has ${foot.totalCols} columns, exceeding the ${maxCols} columns in thead or tbody. This may indicate inconsistent cell count or incorrect colspan/rowspan settings.`,
        el.tFoot,
      );
    }
    maxCols = Math.max(maxCols, foot.totalCols);
  }
  // 标准化表格数据（处理异常表格）
  if (head) {
    normalizeSection(head, maxCols);
  }
  bodies.map((section) => normalizeSection(section, maxCols));
  if (foot) {
    normalizeSection(foot, maxCols);
  }
  // 标记表格
  markTable([head, ...bodies, foot], options);
  return {
    head,
    bodies,
    foot,
  };
};
function isSpanChange(record: MutationRecord) {
  // 不需要检测 record.attributeName，已经在 observe.attributeFilter 中过滤
  return record.type === 'attributes' && record.target instanceof HTMLTableCellElement;
}
function isTableChildChange(record: MutationRecord) {
  if (record.type === 'childList') {
    for (const node of record.addedNodes) {
      if (node instanceof HTMLTableCellElement || node instanceof HTMLTableRowElement || node instanceof HTMLTableSectionElement) {
        return true;
      }
    }
    for (const node of record.removedNodes) {
      if (node instanceof HTMLTableCellElement || node instanceof HTMLTableRowElement || node instanceof HTMLTableSectionElement) {
        return true;
      }
    }
  }
  return false;
}
function shouldRefactorTableMeta(records: MutationRecord[]) {
  for (const record of records) {
    if (isSpanChange(record)) {
      // td 或 th 的 colspan 或 rowspan 属性被修改
      return true;
    }
    if (isTableChildChange(record)) {
      // td, th, tr, thead, tbody, tfoot 被添加或删除（被移动等于先删除再添加）
      return true;
    }
  }
  return false;
}
export function useTableMeta(elRef: MaybeRef<HTMLTableElement | undefined>, options: TableMetaOptions = {}) {
  const cellMap = new WeakMap<HTMLTableCellElement, CellT>();
  const head = shallowRef<TableSection | null>(null);
  const bodies = shallowRef<TableSection[]>([]);
  const foot = shallowRef<TableSection | null>(null);
  let mutationObserver: MutationObserver | null = null;

  const updateMeta = (el: HTMLTableElement) => {
    const _rtn = processTable(el, cellMap, options);
    head.value = _rtn.head;
    bodies.value = _rtn.bodies;
    foot.value = _rtn.foot;
  };

  resolveHtmlElement(elRef).then((el) => {
    if (!(el instanceof HTMLTableElement)) {
      return;
    }
    updateMeta(el);
    const deBounceUpdateMeta = debounce(updateMeta.bind(null, el), 16, false);
    mutationObserver = new MutationObserver((mRecords) => {
      if (shouldRefactorTableMeta(mRecords)) {
        deBounceUpdateMeta();
      }
    });
    mutationObserver.observe(el, { childList: true, subtree: true, attributes: true, attributeFilter: ['colspan', 'rowspan'] });
  });

  onBeforeUnmount(() => {
    mutationObserver?.disconnect();
  });

  // 获取单元格元数据的函数
  function getMeta(cellEl: HTMLTableCellElement): CellT | null {
    return cellMap.get(cellEl) || null;
  }

  return {
    head,
    bodies,
    foot,
    getMeta,
  };
}
