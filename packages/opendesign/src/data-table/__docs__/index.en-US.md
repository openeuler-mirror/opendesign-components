---
sidebar: ODataTable ^[1.2.0](primary)
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

| Property                                    | Type                                                                                                                       | Default Value                                               | Required | Description                                                                                                                                                                                                                                         |
| ------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| key                                         | string                                                                                                                     |                                                             | 🗸        | Field name corresponding to the unique ID of row data                                                                                                                                                                                               |
| label                                       | string \| Component \| VNode                                                                                               | ''                                                          |          | Field for header rendering, supports VNode passing                                                                                                                                                                                                  |
| description ^[1.2.2](primary)               | string \| Component \| VNode                                                                                               | ''                                                          |          | Descriptive text for header, shown as tooltips and supports VNode passing.                                                                                                                                                                          |
| formatter                                   | ({row: any, column: DataTableColumnT, cellValue: any, rowIndex: number, colIndex: number}) => string \| Component \| VNode | ({row, column, cellValue, rowIndex, colIndex}) => cellValue |          | Rendering method for table cells                                                                                                                                                                                                                    |
| fixed                                       | true \| 'left' \| 'right'                                                                                                  | undefined                                                   |          | Fixed column configuration, true is equivalent to left                                                                                                                                                                                              |
| asHeader ^[1.2.2](primary)                  | boolean                                                                                                                    | false                                                       |          | Whether to serve as a vertical header column                                                                                                                                                                                                        |
| width                                       | string \| number                                                                                                           | undefined                                                   |          | Column width                                                                                                                                                                                                                                        |
| minWidth                                    | string \| number                                                                                                           | undefined                                                   |          | Minimum column width                                                                                                                                                                                                                                |
| maxWidth                                    | string \| number                                                                                                           | undefined                                                   |          | Maximum column width                                                                                                                                                                                                                                |
| showHeaderOverflowToolTip ^[1.2.2](primary) | boolean \| number                                                                                                          | 1                                                           |          | Whether to show overflow tooltip for header, pass a number to set the maximum number of lines                                                                                                                                                       |
| showOverflowToolTip ^[1.2.2](primary)       | boolean \| number                                                                                                          | false                                                       |          | Whether to hide overflow and show a tooltip when exceeding the maximum width. Pass a number to set the maximum number of lines                                                                                                                      |
| sortKey ^[1.2.2](primary)                   | string                                                                                                                     | undefined                                                   |          | Sort key bound to the condition object; in single mode, sorting on one column clears others; in multiple mode, sortSequence maintains the operation sequence (array order = user click order), and sort priority interpretation is up to the caller |
| filter ^[1.2.2](primary)                    | [DataTableColumnFilterT](#data-table-column-filter-t)                                                                      | undefined                                                   |          | Filter-related configuration including options                                                                                                                                                                                                      |
| customColSpan ^[1.2.2](primary)             | number                                                                                                                     | undefined                                                   |          | Custom colspan for header cells: only supports merging among same-level siblings                                                                                                                                                                    |
| children                                    | DataTableColumnT[]                                                                                                         | undefined                                                   |          | Nested table header configuration                                                                                                                                                                                                                   |

#### DataTableColumnFilterT ^[1.2.2](primary)

| Property    | Type                                                                                                                                                                                                                                     | Default Value                      | Required | Description                             |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- | -------- | --------------------------------------- |
| optionsFn   | <TLabel = any, TValue = any>(option: { column: EffectiveDataTableColumnT, emptyOption: { label: string; value: typeof TABLE_EMPTY_OPTION_VALUE } }) => { label: TLabel, value: TValue }[] \| Promise<{ label: TLabel, value: TValue }[]> |                                    | 🗸        | Method to fetch filter options          |
| optionTitle | string                                                                                                                                                                                                                                   | undefined                          |          | Title for mobile filter popup           |
| multiple    | boolean                                                                                                                                                                                                                                  | undefined                          |          | Whether to support multi-select         |
| showInput   | boolean \| ((optionsCount: number) => boolean)                                                                                                                                                                                           | (optionsCount) => optionsCount > 8 |          | Whether to show option filter input box |

#### DataTableSortUpdatePayload ^[1.2.2](primary)

| Property                       | Type                 | Description                                                                   |
| ------------------------------ | -------------------- | ----------------------------------------------------------------------------- |
| key                            | string               | The sortKey of the corresponding column                                       |
| newVal                         | 1 \| -1 \| undefined | Sort direction: 1 for ascending, -1 for descending, undefined for no sort     |
| sortSequence ^[1.2.5](primary) | string[]             | The sequence of sort condition activations; see sortSequence prop for details |

### CSS Variables

| CSS Variable                                  | Default                                              | Description                                                                                         |
| --------------------------------------------- | ---------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| --table-filter-trigger-gap                    | 4px                                                  | Filter trigger gap                                                                                  |
| --table-filter-trigger-size                   | 16px                                                 | Filter trigger size                                                                                 |
| --table-head-bg                               | var(--o-color-control3-light)                        | Header background color (fill style)                                                                |
| --table-head-border-bottom                    | var(--table-border-width) solid var(--table-head-bg) | Header bottom border                                                                                |
| --popup-bg-color                              | var(--o-color-control5-light)                        | Filter popup background color                                                                       |
| --popup-radius                                | var(--o-radius-xs)                                   | Filter popup radius                                                                                 |
| --popup-shadow                                | var(--o-shadow-2)                                    | Filter popup shadow                                                                                 |
| --table-filter-popup-width                    | 192px                                                | Filter popup width                                                                                  |
| --table-filter-option-list-max-height-default | 256px                                                | Filter option list default max height                                                               |
| --table-header-height ⚠ Runtime assignment   | -                                                    | Header height (computed from DOM layout internally, CSS override ineffective)                       |
| --table-height ⚠ Runtime assignment          | -                                                    | Table height (assigned by `height` prop, CSS override ineffective)                                  |
| --table-max-height ⚠ Runtime assignment      | -                                                    | Table maximum height (assigned by `maxHeight` prop, CSS override ineffective)                       |
| --table-text-size ⚠ Runtime assignment       | `var(--o-font_size-text1)`                           | Table text font size (read via useCssVar then written back inline, CSS override may be ineffective) |
| --table-text-height ⚠ Runtime assignment     | `var(--o-line_height-text1)`                         | Table text line height (same as above)                                                              |
