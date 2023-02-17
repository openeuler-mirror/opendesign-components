import { Ref } from 'vue';
import { isArray, isFunction, isString } from '../_shared/is';
import { TableColumnT, TableRowT, CellSpanT } from './types';

export function getColumnData(columns?: string[] | TableColumnT[]): TableColumnT[] {
  if (!isArray(columns)) {
    return [];
  }

  return columns.map(item => {
    if (isString(item)) {
      return {
        key: item
      };
    }

    return item;
  });
}
function getSkipCell(rowIndex: number, columnIndex: number, span: { rowspan?: number; colspan?: number }) {
  const skip: Record<string, boolean> = {};
  const { colspan = 1, rowspan = 1 } = span;
  for (let i = 0; i < rowspan; i++) {
    for (let j = 0; j < colspan; j++) {
      if (i !== 0 || j !== 0) {
        skip[`${rowIndex + i}-${columnIndex + j}`] = true;
      }
    }
  }
  return skip;
}
interface CellT {
  value: any,
  key: string | number,
  colspan?: number,
  rowspan?: number,
  last?: boolean
}

export function getBodyData(columnData: Ref<TableColumnT[]>, bodyData?: TableRowT[], cellSpan?: CellSpanT) {
  if (!bodyData) {
    return [];
  }
  let t = bodyData.length;
  let s = 0;

  const colLenght = columnData.value.length;

  const rlt = [];
  let span = null;
  const skipCell: Record<string, boolean> = {};
  console.log(s, t);
  const end = Math.min(s + t, bodyData.length);

  for (let r = s; r < end; r += 1) {
    const row = bodyData[r];
    let cols = [];
    for (let c = 0; c < colLenght; c += 1) {
      const col = columnData.value[c];
      if (isFunction(cellSpan)) {
        span = cellSpan(r, c);
      }
      const cell: CellT = {
        value: row[col.key],
        key: col.key
      };

      if (span) {
        const { colspan = 1, rowspan = 1 } = span;
        Object.assign(skipCell, getSkipCell(r, c, span));

        if (colspan > 1) {
          cell.colspan = colspan;
        }
        if (rowspan > 1) {
          cell.rowspan = rowspan;
        }
      }


      if (!skipCell[`${r}-${c}`]) {
        if (c === colLenght - 1) {
          cell.last = true;
        }
        cols.push(cell);
      }
    }
    rlt.push({ key: row.key, data: cols });
  }

  return rlt;
}
