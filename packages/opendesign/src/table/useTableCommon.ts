import { computed, MaybeRef, toValue } from 'vue';

import { isString, isHoverDevice } from '../_utils/is';
import { useI18n } from '../locale';

import { TablePropsT } from './types';
import { useTableMeta } from './useTableMeta';

export const useTableCommon = (options: {
  props: Pick<TablePropsT, 'emptyLabel' | 'loadingLabel' | 'border'>;
  tableEl: MaybeRef<HTMLTableElement | undefined>;
}) => {
  const { props, tableEl } = options;
  const { t } = useI18n();
  const emptyLabel = computed(() => props.emptyLabel || t('common.empty'));
  const loadingLabel = computed(() => props.loadingLabel || t('common.loading'));

  const borderClass = computed(() => {
    if (isString(props.border)) {
      return props.border.split('-').map((item) => `o-table-border-${item}`);
    }
    return '';
  });

  // 通过 useTableMeta 获取表格元数据并添加或删除类名
  // 之所以通过直接操作 dom 的方式处理，是因为用户可能通过插槽渲染表格，
  // 导致无法通过tableData计算元数据以及无法通过vue模板语法设置类名
  const tableMeta = useTableMeta(tableEl, { markCellLastCol: true, markCellLastRow: true, markRowLast: true });

  const highlightedDoms: Array<HTMLTableRowElement | HTMLTableCellElement> = [];
  let highlightTrigger: HTMLTableCellElement | null = null;
  const clearHighlight = () => {
    highlightedDoms.forEach((cell) => {
      cell.classList.remove('o-table-highlight');
    });
    highlightedDoms.length = 0;
    highlightTrigger = null;
  };
  const applyHighlight = (dom: HTMLTableRowElement | HTMLTableCellElement, className: string) => {
    highlightedDoms.push(dom);
    dom.classList.add(className);
  };
  const highlightTable = (cell: HTMLTableCellElement) => {
    if (highlightTrigger === cell) {
      // 避免重复添加高亮样式
      return;
    }
    clearHighlight();
    highlightTrigger = cell;
    const cellMeta = tableMeta.getMeta(cell);
    if (!cellMeta || cellMeta.section.scope !== 'body') {
      return;
    }
    const section = cellMeta.section;
    const rowEl = section.rows[cellMeta.rowStart];
    const rowSpan = cellMeta.el.rowSpan;
    const className = 'o-table-highlight';
    applyHighlight(rowEl, className);
    if (rowSpan === 1) {
      const rows = section.data[cellMeta.rowStart];
      rows.forEach((item) => {
        if (item && item.el.parentElement !== rowEl) {
          applyHighlight(item.el, className);
        }
      });
    } else {
      for (let i = cellMeta.rowStart + 1; i < cellMeta.rowEnd; i++) {
        const rowElItem = section.rows[i];
        if (rowElItem) {
          applyHighlight(rowElItem, className);
        }
      }
    }
  };
  const getTdEl = (el: EventTarget | null) => {
    if (!(el instanceof HTMLElement)) {
      return null;
    }
    let current: HTMLElement | null = el;
    while (current && current.tagName !== 'TD' && current.tagName !== 'TH' && current !== toValue(tableEl) && current !== document.body) {
      current = current.parentElement;
    }
    return current?.tagName === 'TD' ? (current as HTMLTableCellElement) : null;
  };
  const handleMouseOver = (e: MouseEvent) => {
    const target = getTdEl(e.target);
    if (!target || !isHoverDevice) {
      return;
    }
    highlightTable(target);
  };
  const handleTouchStart = (e: TouchEvent) => {
    const target = getTdEl(e.target);
    if (!target) {
      return;
    }
    highlightTable(target);
  };

  return {
    emptyLabel,
    loadingLabel,
    borderClass,
    handleMouseOver,
    clearHighlight,
    handleTouchStart,
  };
};
