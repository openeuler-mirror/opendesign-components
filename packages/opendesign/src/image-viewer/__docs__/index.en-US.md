---
sidebar: OImageViewer Image Preview ^[NEXT](primary)
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

| CSS Variable                                            | Description                       |
| ------------------------------------------------------- | --------------------------------- |
| \-\-image-viewer-ratio-width ^[NEXT](primary)           | Zoom ratio badge width            |
| \-\-image-viewer-ratio-height ^[NEXT](primary)          | Zoom ratio badge height           |
| \-\-image-viewer-ratio-bgc ^[NEXT](primary)             | Zoom ratio badge background color |
| \-\-image-viewer-ratio-color ^[NEXT](primary)           | Zoom ratio badge text color       |
| \-\-image-viewer-ratio-radius ^[NEXT](primary)          | Zoom ratio badge border radius    |
| \-\-image-viewer-ratio-backdrop-filter ^[NEXT](primary) | Zoom ratio badge backdrop blur    |
| \-\-image-viewer-action-bottom ^[NEXT](primary)         | Action area bottom offset         |
| \-\-image-viewer-action-padding ^[NEXT](primary)        | Action area padding               |
| \-\-image-viewer-action-item-gap ^[NEXT](primary)       | Gap between action items          |
| \-\-image-viewer-action-bgc ^[NEXT](primary)            | Action area background color      |
| \-\-image-viewer-action-radius ^[NEXT](primary)         | Action area border radius         |
| \-\-image-viewer-cursor-type ^[NEXT](primary)           | Cursor type during drag           |
| \-\-image-viewer-icon-color ^[NEXT](primary)            | Action icon color                 |
| \-\-image-viewer-icon-color-hover ^[NEXT](primary)      | Action icon hover color           |
| \-\-image-viewer-icon-size ^[NEXT](primary)             | Action icon size                  |
| \-\-image-viewer-nav-size ^[NEXT](primary)              | Prev/Next button size             |
| \-\-image-viewer-nav-color ^[NEXT](primary)             | Prev/Next button color            |
| \-\-image-viewer-nav-color-hover ^[NEXT](primary)       | Prev/Next button hover color      |
| \-\-image-viewer-nav-color-disabled ^[NEXT](primary)    | Prev/Next button disabled color   |
| \-\-image-viewer-progress-color ^[NEXT](primary)        | Progress indicator text color     |
| \-\-image-viewer-error-color ^[NEXT](primary)           | Image load error text color       |

<!-- @api OImageViewer  -->
