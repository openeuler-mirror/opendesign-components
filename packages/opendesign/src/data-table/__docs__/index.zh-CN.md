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

| 属性名    | 类型                                                                                                                       | 默认值                                                      | 必填 | 说明                            |
| --------- | -------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- | ---- | ------------------------------- |
| key       | string                                                                                                                     |                                                             | 🗸    | 列数据唯一标识对应的字段名      |
| label     | string \| Component \| VNode                                                                                               | ''                                                          |      | 表头对应渲染字段，支持传入VNode |
| formatter | ({row: any, column: DataTableColumnT, cellValue: any, rowIndex: number, colIndex: number}) => string \| Component \| VNode | ({row, column, cellValue, rowIndex, colIndex}) => cellValue |      | 单元格的渲染方法                |
| fixed     | true \| 'left' \| 'right'                                                                                                  | undefined                                                   |      | 固定列配置，true与left等效      |
| width     | string \| number                                                                                                           | undefined                                                   |      | 列宽                            |
| minWidth  | string \| number                                                                                                           | undefined                                                   |      | 最小列宽                        |
| maxWidth  | string \| number                                                                                                           | undefined                                                   |      | 最大列宽                        |
| sortKey   | string                                                                                                                     | undefined                                                   |      | 触发排序时传给参数对象值的key   |
| filter    | [DataTableColumnFilterT](#data-table-column-filter-t)                                                                      | undefined                                                   |      | 供筛选的选项等配置条件          |
| children  | DataTableColumnT[]                                                                                                         | undefined                                                   |      | 嵌套表头配置                    |

#### DataTableColumnFilterT

| 属性名      | 类型                                                                                                                                                                                                                                     | 默认值                             | 必填 | 说明                   |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- | ---- | ---------------------- |
| optionsFn   | <TLabel = any, TValue = any>(option: { column: EffectiveDataTableColumnT, emptyOption: { label: string; value: typeof TABLE_EMPTY_OPTION_VALUE } }) => { label: TLabel, value: TValue }[] \| Promise<{ label: TLabel, value: TValue }[]> |                                    | 🗸    | 获取筛选可选项的方法   |
| optionTitle | string                                                                                                                                                                                                                                   | undefined                          |      | 移动端弹窗的title      |
| multiple    | boolean                                                                                                                                                                                                                                  | undefined                          |      | 是否支持多选           |
| showInput   | boolean \| ((optionsCount: number) => boolean)                                                                                                                                                                                           | (optionsCount) => optionsCount > 8 |      | 是否显示选项筛选输入框 |
