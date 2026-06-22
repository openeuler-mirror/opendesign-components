---
sidebar: ODataTable 数据表格 ^[1.2.0](primary)
kind: container
---

# 数据表格

## 示例

<!-- @usage DataTableUsage -->
<!-- @case DataTableBasic -->
<!-- @case DataTableColumnHeader -->
<!-- @case DataTableHeaderStyle -->
<!-- @case DataTableFilterSorter -->
<!-- @case DataTableFilterSorterWatch -->
<!-- @case DataTableMultiSort -->
<!-- @case DataTablePagination -->
<!-- @case DataTableExpand -->
<!-- @case DataTableTree -->
<!-- @case DataTableSelection -->

## API

<!-- @api ODataTable -->

#### DataTableColumnT

| 属性名                                      | 类型                                                                                                                       | 默认值                                                      | 必填 | 说明                                                                                                                                                                                                                          |
| ------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- | ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| key                                         | string                                                                                                                     |                                                             | 🗸    | 列数据唯一标识对应的字段名                                                                                                                                                                                                    |
| label                                       | string \| Component \| VNode                                                                                               | ''                                                          |      | 表头对应渲染字段，支持传入VNode                                                                                                                                                                                               |
| description ^[1.2.2](primary)               | string \| Component \| VNode                                                                                               | ''                                                          |      | 列表头的描述文案，会以气泡的形式展示，支持传入VNode                                                                                                                                                                           |
| formatter                                   | ({row: any, column: DataTableColumnT, cellValue: any, rowIndex: number, colIndex: number}) => string \| Component \| VNode | ({row, column, cellValue, rowIndex, colIndex}) => cellValue |      | 单元格的渲染方法                                                                                                                                                                                                              |
| fixed                                       | true \| 'left' \| 'right'                                                                                                  | undefined                                                   |      | 固定列配置，true与left等效                                                                                                                                                                                                    |
| asHeader ^[1.2.2](primary)                  | boolean                                                                                                                    | false                                                       |      | 是否是作为竖向表头列                                                                                                                                                                                                          |
| width                                       | string \| number                                                                                                           | undefined                                                   |      | 列宽                                                                                                                                                                                                                          |
| minWidth                                    | string \| number                                                                                                           | undefined                                                   |      | 最小列宽                                                                                                                                                                                                                      |
| maxWidth                                    | string \| number                                                                                                           | undefined                                                   |      | 最大列宽                                                                                                                                                                                                                      |
| showHeaderOverflowToolTip ^[1.2.2](primary) | boolean \| number                                                                                                          | 1                                                           |      | 表头是否显示溢出隐藏气泡，传入数字以设置最大行数                                                                                                                                                                              |
| showOverflowToolTip ^[1.2.2](primary)       | boolean \| number                                                                                                          | false                                                       |      | 是否在超出最大宽度时隐藏溢出并使用气泡提示，传入数字以设置最大行数                                                                                                                                                            |
| sortKey ^[1.2.2](primary)                   | string                                                                                                                     | undefined                                                   |      | 排序方式绑定的条件对象的key；sortMode 为 single 时为单条件排序，当前列排序修改后会清空其他列的排序；sortMode 为 multiple 时为多条件排序，通过 sortSequence 维护排序条件的操作序列，序列仅记录操作先后，优先级由调用者自行解读 |
| filter ^[1.2.2](primary)                    | [DataTableColumnFilterT](#data-table-column-filter-t)                                                                      | undefined                                                   |      | 供筛选的选项等配置条件                                                                                                                                                                                                        |
| customColSpan ^[1.2.2](primary)             | number                                                                                                                     | undefined                                                   |      | 表头单元格的自定义colspan，仅支持同层级兄弟单元格之间的合并                                                                                                                                                                   |
| children                                    | DataTableColumnT[]                                                                                                         | undefined                                                   |      | 嵌套表头配置                                                                                                                                                                                                                  |

#### DataTableColumnFilterT ^[1.2.2](primary)

| 属性名      | 类型                                                                                                                                                                                                                                     | 默认值                             | 必填 | 说明                   |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- | ---- | ---------------------- |
| optionsFn   | <TLabel = any, TValue = any>(option: { column: EffectiveDataTableColumnT, emptyOption: { label: string; value: typeof TABLE_EMPTY_OPTION_VALUE } }) => { label: TLabel, value: TValue }[] \| Promise<{ label: TLabel, value: TValue }[]> |                                    | 🗸    | 获取筛选可选项的方法   |
| optionTitle | string                                                                                                                                                                                                                                   | undefined                          |      | 移动端弹窗的title      |
| multiple    | boolean                                                                                                                                                                                                                                  | undefined                          |      | 是否支持多选           |
| showInput   | boolean \| ((optionsCount: number) => boolean)                                                                                                                                                                                           | (optionsCount) => optionsCount > 8 |      | 是否显示选项筛选输入框 |

#### DataTableSortUpdatePayload ^[1.2.2](primary)

| 属性名                        | 类型                 | 说明                                              |
| ----------------------------- | -------------------- | ------------------------------------------------- |
| key                           | string               | 对应column的sortKey                               |
| newVal                        | 1 \| -1 \| undefined | 排序方向，1 为升序，-1 为降序，undefined 为不排序 |
| sortSequence ^[NEXT](primary) | string[]             | 排序条件的操作序列，详细说明见 sortSequence prop  |

### CSS 变量

| CSS 变量                                      | 默认值                                               | 描述                                                                |
| --------------------------------------------- | ---------------------------------------------------- | ------------------------------------------------------------------- |
| --table-filter-trigger-gap                    | 4px                                                  | 筛选触发器间距                                                      |
| --table-filter-trigger-size                   | 16px                                                 | 筛选触发器大小                                                      |
| --table-head-bg                               | var(--o-color-control3-light)                        | 表头背景色（fill 风格）                                             |
| --table-head-border-bottom                    | var(--table-border-width) solid var(--table-head-bg) | 表头底部边框                                                        |
| --popup-bg-color                              | var(--o-color-control5-light)                        | 筛选弹窗背景色                                                      |
| --popup-radius                                | var(--o-radius-xs)                                   | 筛选弹窗圆角                                                        |
| --popup-shadow                                | var(--o-shadow-2)                                    | 筛选弹窗阴影                                                        |
| --table-filter-popup-width                    | 192px                                                | 筛选弹窗宽度                                                        |
| --table-filter-option-list-max-height-default | 256px                                                | 筛选选项列表默认最大高度                                            |
| --table-header-height ⚠ 运行时赋值           | -                                                    | 表头高度（由组件内部根据 DOM 封闭计算赋值，CSS 覆盖无效）           |
| --table-height ⚠ 运行时赋值                  | -                                                    | 表格高度（由 `height` prop 赋值，CSS 覆盖无效）                     |
| --table-max-height ⚠ 运行时赋值              | -                                                    | 表格最大高度（由 `maxHeight` prop 赋值，CSS 覆盖无效）              |
| --table-text-size ⚠ 运行时赋值               | `var(--o-font_size-text1)`                           | 表格文字字号（由 useCssVar 读取后再 inline 写回，CSS 覆盖可能无效） |
| --table-text-height ⚠ 运行时赋值             | `var(--o-line_height-text1)`                         | 表格文字行高（同上）                                                |
