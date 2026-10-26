---
sidebar: OImageViewer 图片预览 ^[1.2.7](primary)
kind: display
---

# OImageViewer 图片预览

支持图片拖拽、缩放、旋转、多图切换的预览组件。组件内部持有 `OLayer`，通过 `v-model:visible` 控制预览显隐，通过 `layer-options` 配置遮罩层行为。可独立使用，也可搭配 `OFigure` 组件作为图片预览浮层。

## 示例

<!-- @case ImageViewerBasic -->
<!-- @case ImageViewerOversized -->
<!-- @case ImageViewerZoomBounds -->
<!-- @case ImageViewerScaleControl -->
<!-- @case ImageViewerStandalone -->
<!-- @case ImageViewerError -->
<!-- @case ImageViewerInFigure -->
<!-- @case ImageViewerFunctional -->
<!-- @case ImageViewerAccessibility -->
<!-- @case ImageViewerSlots -->
<!-- @case ImageViewerCrossorigin -->

## API

#### CSS 变量

| CSS 变量                                                 | 描述                      |
| -------------------------------------------------------- | ------------------------- |
| \-\-image-viewer-ratio-width ^[1.2.7](primary)           | 缩放比例提示框宽度        |
| \-\-image-viewer-ratio-height ^[1.2.7](primary)          | 缩放比例提示框高度        |
| \-\-image-viewer-ratio-bgc ^[1.2.7](primary)             | 缩放比例提示框背景色      |
| \-\-image-viewer-ratio-color ^[1.2.7](primary)           | 缩放比例提示框文字颜色    |
| \-\-image-viewer-ratio-radius ^[1.2.7](primary)          | 缩放比例提示框圆角        |
| \-\-image-viewer-ratio-backdrop-filter ^[1.2.7](primary) | 缩放比例提示框背景模糊    |
| \-\-image-viewer-action-bottom ^[1.2.7](primary)         | 操作区距底部偏移          |
| \-\-image-viewer-action-padding ^[1.2.7](primary)        | 操作区内边距              |
| \-\-image-viewer-action-item-gap ^[1.2.7](primary)       | 操作项间距                |
| \-\-image-viewer-action-bgc ^[1.2.7](primary)            | 操作区背景色              |
| \-\-image-viewer-action-radius ^[1.2.7](primary)         | 操作区圆角                |
| \-\-image-viewer-cursor-type ^[1.2.7](primary)           | 拖拽时光标类型            |
| \-\-image-viewer-icon-color ^[1.2.7](primary)            | 操作图标颜色              |
| \-\-image-viewer-icon-color-hover ^[1.2.7](primary)      | 操作图标悬停颜色          |
| \-\-image-viewer-icon-size ^[1.2.7](primary)             | 操作图标尺寸              |
| \-\-image-viewer-nav-size ^[1.2.7](primary)              | 上一张/下一张按钮尺寸     |
| \-\-image-viewer-nav-color ^[1.2.7](primary)             | 上一张/下一张按钮颜色     |
| \-\-image-viewer-nav-color-hover ^[1.2.7](primary)       | 上一张/下一张按钮悬停颜色 |
| \-\-image-viewer-nav-color-disabled ^[1.2.7](primary)    | 上一张/下一张按钮禁用颜色 |
| \-\-image-viewer-progress-color ^[1.2.7](primary)        | 进度指示器文字颜色        |
| \-\-image-viewer-error-color ^[1.2.7](primary)           | 图片加载错误提示颜色      |

<!-- @api OImageViewer  -->
