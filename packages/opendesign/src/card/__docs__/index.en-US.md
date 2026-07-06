---
sidebar: OCard
kind: container
---

# OCard

## Demo

<!-- @usage CardUsage -->
<!-- @case CardSlot -->

<!-- @case:k KunpengPlainText -->
<!-- @case:k KunpengImage -->
<!-- @case:k KunpengComposite1 -->
<!-- @case:k KunpengComposite2 -->
<!-- @case:k KunpengPlainImage1 -->
<!-- @case:k KunpengPlainImage2 -->

<!-- @case:e OpenEulerPlainText -->
<!-- @case:e OpenEulerImage -->
<!-- @case:e OpenEulerComposite1 -->
<!-- @case:e OpenEulerComposite2 -->
<!-- @case:e OpenEulerPlainImage1 -->
<!-- @case:e OpenEulerPlainImage2 -->

<!-- @case:a AscendPlainText -->
<!-- @case:a AscendImage -->
<!-- @case:a AscendComposite1 -->
<!-- @case:a AscendComposite2 -->
<!-- @case:a AscendPlainImage1 -->
<!-- @case:a AscendPlainImage2 -->

## API

### CSS 变量

| CSS Variables | Description |
| --- | --- |
| \-\-card-bg-color | Background color |
| \-\-card-radius | Border radius |
| \-\-card-shadow | Shadow in normal state |
| \-\-card-shadow-hover | Shadow in hover state |
| \-\-card-shadow-active | Shadow in active state |
| \-\-card-cover-radius | Cover border radius |
| \-\-card-h-cover-width | Horizontal cover width (effective in horizontal layout) |
| \-\-card-h-cover-max-width | Maximum horizontal cover width (effective in horizontal layout) |
| \-\-card-main-padding-v | Vertical padding of main content area |
| \-\-card-main-padding-h | Horizontal padding of main content area |
| \-\-card-main-padding | Defines the main content padding by combining vertical and horizontal padding values: `var(--card-main-padding-v) var(--card-main-padding-h)` |
| \-\-card-icon-gap | Spacing between icon and content: bottom margin in vertical layout, right margin in horizontal layout, left margin in reverse horizontal layout |
| \-\-card-icon-color | Icon color |
| \-\-card-icon-size | Icon size |
| \-\-card-title-icon-color | Title prefix icon color |
| \-\-card-title-icon-gap  | Spacing between title prefix icon and text  |
| \-\-card-title-icon-size | Title prefix icon size                      |
| \-\-card-header-color | Header color |
| \-\-card-header-text-size | Header text size |
| \-\-card-header-text-height | Header text height |
| \-\-card-header-text-weight ^[1.2.4](primary) | Header font weight, default 600 (changed from 500 since v1.2.4) |
| \-\-card-title-word-break | Word-break property value for title |
| \-\-card-title-row ⚠ Runtime assignment | Title row limit (assigned by `titleRow` prop, CSS override ineffective) |
| \-\-card-title-max-row ⚠ Runtime assignment | Title max row limit (assigned by `titleMaxRow` prop, CSS override ineffective) |
| \-\-card-content-gap | Spacing between title and content |
| \-\-card-content-color | Content color |
| \-\-card-content-text-size | Content text size |
| \-\-card-content-text-height | Content text height |
| \-\-card-detail-word-break | Word-break property value for detail |
| \-\-card-detail-row ⚠ Runtime assignment | Detail row limit (assigned by `detailRow` prop, CSS override ineffective) |
| \-\-card-detail-max-row ⚠ Runtime assignment | Detail max row limit (assigned by `detailMaxRow` prop, CSS override ineffective) |
| \-\-card-footer-gap | Spacing between footer and content |
| \-\-card-footer-color | Footer color |
| \-\-card-footer-text-size | Footer text size |
| \-\-card-footer-text-height | Footer text height |
| \-\-card-cover-padding | Cover padding |

<!-- @api OCard -->
