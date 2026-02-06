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

| 属性名    | 类型                                                                                                                       | 默认值                                                      | 必填 | 说明                            |
| --------- | -------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- | ---- | ------------------------------- |
| key       | string                                                                                                                     |                                                             | 🗸    | 列数据唯一标识对应的字段名      |
| label     | string \| Component \| VNode                                                                                               | ''                                                          |      | 表头对应渲染字段，支持传入VNode |
| formatter | ({row: any, column: DataTableColumnT, cellValue: any, rowIndex: number, colIndex: number}) => string \| Component \| VNode | ({row, column, cellValue, rowIndex, colIndex}) => cellValue |      | 单元格的渲染方法                |
| fixed     | true \| 'left' \| 'right'                                                                                                  | undefined                                                   |      | 固定列配置，true与left等效      |
| width     | string \| number                                                                                                           | undefined                                                   |      | 列宽                            |
| minWidth  | string \| number                                                                                                           | undefined                                                   |      | 最小列宽                        |
| maxWidth  | string \| number                                                                                                           | undefined                                                   |      | 最大列宽                        |
| children  | DataTableColumnT[]                                                                                                         | undefined                                                   |      | 嵌套表头配置                    |
