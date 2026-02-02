---
sidebar: ODataTable 数据表格
kind: container
---

# 数据表格

## 示例

<!-- @usage DataTableUsage -->
<!-- @case DataTableBasic -->

## API

<!-- @api ODataTable -->

#### DataTableColumnT

| Property  | Type                                                                                                                       | Default Value                                               | Required | Description                                            |
| --------- | -------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- | -------- | ------------------------------------------------------ |
| key       | string                                                                                                                     |                                                             | 🗸        | Field name corresponding to the unique ID of row data  |
| label     | string \| Component \| VNode                                                                                               | ''                                                          |          | Field for header rendering, supports VNode passing     |
| formatter | ({row: any, column: DataTableColumnT, cellValue: any, rowIndex: number, colIndex: number}) => string \| Component \| VNode | ({row, column, cellValue, rowIndex, colIndex}) => cellValue |          | Rendering method for table cells                       |
| fixed     | true \| 'left' \| 'right'                                                                                                  | undefined                                                   |          | Fixed column configuration, true is equivalent to left |
| width     | string \| number                                                                                                           | undefined                                                   |          | Column width                                           |
| minWidth  | string \| number                                                                                                           | undefined                                                   |          | Minimum column width                                   |
| maxWidth  | string \| number                                                                                                           | undefined                                                   |          | Maximum column width                                   |
| children  | DataTableColumnT[]                                                                                                         | undefined                                                   |          | Nested table header configuration                      |
