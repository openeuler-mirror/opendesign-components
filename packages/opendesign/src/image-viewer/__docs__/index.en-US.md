---
sidebar: OImageViewer Image Preview ^[1.2.7](primary)
kind: display
---

# OImageViewer Image Preview

An image preview component supporting drag, zoom, rotation, and multi-image navigation. The component holds an internal `OLayer` — control visibility via `v-model:visible` and configure mask behavior via `layer-options`. Can be used standalone or with `OFigure` as a preview overlay.

## Examples

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

#### CSS Variables

| CSS Variable                                             | Description                       |
| -------------------------------------------------------- | --------------------------------- |
| \-\-image-viewer-ratio-width ^[1.2.7](primary)           | Zoom ratio badge width            |
| \-\-image-viewer-ratio-height ^[1.2.7](primary)          | Zoom ratio badge height           |
| \-\-image-viewer-ratio-bgc ^[1.2.7](primary)             | Zoom ratio badge background color |
| \-\-image-viewer-ratio-color ^[1.2.7](primary)           | Zoom ratio badge text color       |
| \-\-image-viewer-ratio-radius ^[1.2.7](primary)          | Zoom ratio badge border radius    |
| \-\-image-viewer-ratio-backdrop-filter ^[1.2.7](primary) | Zoom ratio badge backdrop blur    |
| \-\-image-viewer-action-bottom ^[1.2.7](primary)         | Action area bottom offset         |
| \-\-image-viewer-action-padding ^[1.2.7](primary)        | Action area padding               |
| \-\-image-viewer-action-item-gap ^[1.2.7](primary)       | Gap between action items          |
| \-\-image-viewer-action-bgc ^[1.2.7](primary)            | Action area background color      |
| \-\-image-viewer-action-radius ^[1.2.7](primary)         | Action area border radius         |
| \-\-image-viewer-cursor-type ^[1.2.7](primary)           | Cursor type during drag           |
| \-\-image-viewer-icon-color ^[1.2.7](primary)            | Action icon color                 |
| \-\-image-viewer-icon-color-hover ^[1.2.7](primary)      | Action icon hover color           |
| \-\-image-viewer-icon-size ^[1.2.7](primary)             | Action icon size                  |
| \-\-image-viewer-nav-size ^[1.2.7](primary)              | Prev/Next button size             |
| \-\-image-viewer-nav-color ^[1.2.7](primary)             | Prev/Next button color            |
| \-\-image-viewer-nav-color-hover ^[1.2.7](primary)       | Prev/Next button hover color      |
| \-\-image-viewer-nav-color-disabled ^[1.2.7](primary)    | Prev/Next button disabled color   |
| \-\-image-viewer-progress-color ^[1.2.7](primary)        | Progress indicator text color     |
| \-\-image-viewer-error-color ^[1.2.7](primary)           | Image load error text color       |

<!-- @api OImageViewer  -->
