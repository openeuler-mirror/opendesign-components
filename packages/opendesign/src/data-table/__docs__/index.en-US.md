---
sidebar: ODataTable 数据表格
kind: container
---

# 数据表格

## 示例

<!-- @usage DataTableUsage -->
<!-- @case DataTableBasic -->
<!-- @case DataTableFilterSorter -->

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
| sortKey   | string                                                                                                                     | undefined                                                   |          | 触发排序时传给参数对象值的key                          |
| filter    | [DataTableColumnFilterT](#data-table-column-filter-t)                                                                      | undefined                                                   |          | 供筛选的选项等配置条件                                 |
| children  | DataTableColumnT[]                                                                                                         | undefined                                                   |          | Nested table header configuration                      |

#### DataTableColumnFilterT

| Property    | Type                                                                                                                                                                                                                                     | Default Value                      | Required | Description            |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- | -------- | ---------------------- |
| optionsFn   | <TLabel = any, TValue = any>(option: { column: EffectiveDataTableColumnT, emptyOption: { label: string; value: typeof TABLE_EMPTY_OPTION_VALUE } }) => { label: TLabel, value: TValue }[] \| Promise<{ label: TLabel, value: TValue }[]> |                                    | 🗸        | 获取筛选可选项的方法   |
| optionTitle | string                                                                                                                                                                                                                                   | undefined                          |          | 移动端弹窗的title      |
| multiple    | boolean                                                                                                                                                                                                                                  | undefined                          |          | 是否支持多选           |
| showInput   | boolean \| ((optionsCount: number) => boolean)                                                                                                                                                                                           | (optionsCount) => optionsCount > 8 |          | 是否显示选项筛选输入框 |
