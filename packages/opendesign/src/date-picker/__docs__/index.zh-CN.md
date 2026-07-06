---
sidebar: ODatePicker 日期选择器 ^[1.2.4](primary)
kind: input
---

## 日期选择器

<!-- @usage DatePickerUsage -->
<!-- @case DatePickerMode -->
<!-- @case DatePickerFormat -->
<!-- @case DatePickerModelValue -->
<!-- @case DatePickerDisabled -->
<!-- @case DatePickerEvents -->

## 日期时间选择器

<!-- @usage DateTimePickerUsage -->
<!-- @case DateTimePickerFormat -->
<!-- @case DateTimePickerDisabled -->
<!-- @case DateTimePickerShortcut -->
<!-- @case DateTimePickerTimeConstraint -->
<!-- @case DateTimePickerEvents -->

## 月份选择器

<!-- @usage MonthPickerUsage -->
<!-- @case MonthPickerFormat -->
<!-- @case MonthPickerDisabled -->
<!-- @case MonthPickerShortcut -->
<!-- @case MonthPickerEvents -->

## 年份选择器

<!-- @usage YearPickerUsage -->
<!-- @case YearPickerFormat -->
<!-- @case YearPickerDisabled -->
<!-- @case YearPickerShortcut -->
<!-- @case YearPickerEvents -->

## 范围选择器

<!-- @case RangePicker -->
<!-- @case RangePickerDisabled -->
<!-- @case RangePickerEvents -->
<!-- @case DatePickerFocus -->

## API

### CSS 变量

| CSS 变量                                                | 描述                                   | 默认值                         |
| ------------------------------------------------------- | -------------------------------------- | ------------------------------ |
| `--date-range-picker-bg-color-focus`  | 范围选择器聚焦时背景色                 | `var(--o-color-control2-light)` |
| `--date-panel-bg`                     | 面板背景色                             | `var(--o-color-fill2)`         |
| `--date-panel-shadow`                 | 面板阴影                               | `var(--o-shadow-2)`            |
| `--date-panel-operation-padding-x`   | header/footer 横向内间距               | `28px`                         |
| `--date-panel-operation-height`      | header/footer 高度                     | `40px`                         |
| `--date-panel-operation-text-size`   | header/footer 字号                     | `var(--o-font_size-tip1)`      |
| `--date-panel-operation-text-height` | header/footer 行高                     | `var(--o-line_height-tip1)`    |
| `--date-panel-text-size`             | 面板文字字号                           | `var(--o-font_size-tip1)`      |
| `--date-panel-text-height`           | 面板文字行高                           | `var(--o-line_height-text1)`   |
| `--date-panel-cell-color`            | 普通日期文字颜色                       | `var(--o-color-info1)`         |
| `--date-panel-cell-color-active`     | 激活日期文字颜色                       | `var(--o-color-info1-inverse)` |
| `--date-panel-cell-color-disabled`   | 禁用日期/非本月文字颜色                | `var(--o-color-info4)`         |
| `--date-panel-cell-bg-hover`         | 日期 hover 背景色                      | `var(--o-color-control2-light)` |
| `--date-panel-cell-bg-active`        | 激活日期背景色                         | `var(--o-color-primary1)`      |
| `--date-panel-cell-bg-range`         | 范围中间日期背景色                     | `var(--o-color-control2-light)` |
| `--date-panel-cell-today-bd-color`   | 今日日期边框颜色                       | `var(--o-color-primary1)`      |

<!-- @api ODatePicker -->
<!-- @api ODateRangePicker -->
<!-- @api OYearPicker -->
<!-- @api OYearRangePicker -->
<!-- @api OMonthPicker -->
<!-- @api OMonthRangePicker -->
<!-- @api ODateTimePicker -->
<!-- @api ODateTimeRangePicker -->
