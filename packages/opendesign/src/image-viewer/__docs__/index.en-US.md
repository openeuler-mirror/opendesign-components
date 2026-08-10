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
<!-- @case ImageViewerStandalone -->
<!-- @case ImageViewerError -->
<!-- @case ImageViewerInFigure -->
<!-- @case ImageViewerFunctional -->

### Basic

Pass an array of image URLs via `preview-list`. Supports wheel zoom, mouse drag, pinch-to-zoom, and rotation interactions. Images default to original size, auto-scaled to fit the screen if larger, but can be zoomed to any size.

Control visibility via `v-model:visible`. Use `toolbar` to customize which tool buttons are shown and their order. The default includes zoom out, zoom in, reset, rotate left, rotate right, and close. Pass `false` to hide the entire action area. Additionally, `layer-options.buttonClose` independently controls OLayer's built-in top-right close button (rendered by default).

Use `infinite` to enable infinite loop navigation. Use `show-progress` to display an image switching progress indicator.

### Zoom & Rotation

- `zoom-rate`: Controls the zoom rate per step. Higher values mean faster zoom. Default `1.2`.
- `min-scale` / `max-scale`: Limit the user's manual zoom range to prevent over-shrinking or over-enlarging. When the fit-to-screen scale (containScale) falls below `min-scale`, the effective lower bound automatically expands to containScale, ensuring the initial display is a fully visible contain state and that zooming in from that position transitions smoothly without jumping to `min-scale`.
- `scale`: Sets the initial zoom ratio. Default `1` (original size). After loading, if the image exceeds the screen, a fit-to-screen scale is automatically calculated; reset returns to this ratio.
- `show-zoom-ratio`: Briefly displays the current zoom percentage. `duration` controls how long the hint stays (in milliseconds).
- `scalable`: Whether image scaling is allowed. Default `true`. When `false`, scaling is locked to the fit-to-screen ratio on non-mobile devices (hover-capable with fine pointer) — wheel, keyboard, and other zoom interactions are disabled; zoom-related toolbar buttons (zoom out, zoom in, reset) are hidden, and if only `close` remains after filtering, the entire action area is hidden. Pinch-to-zoom remains available on touch devices (natural gesture).
- `rotateLeft` / `rotateRight` in `toolbar` rotate the image 90° counter-clockwise / clockwise respectively. The `rotate` event fires on rotation.

### Oversized Image Auto-Fit

When the image's original size exceeds the screen, the component automatically calculates a fit-to-screen scale: scales to fit entirely (contain, not exceeding original size). Switching images or clicking reset returns to this fit ratio. Using 4K resolution images (3840×2160 landscape / 2160×3840 portrait) demonstrates the auto-fit behavior — you can also zoom beyond the screen via wheel or pinch.

### Mask Layer Configuration

`OImageViewer` holds an internal `OLayer`. Configure mask behavior via `layer-options`:

| Option        | Description                                    | Default |
| ------------- | ---------------------------------------------- | ------- |
| `mask`        | Whether to render the mask layer               | `true`  |
| `maskClose`   | Whether clicking the mask closes the preview   | `false` |
| `buttonClose` | Whether to render a top-right close button     | `true`  |
| `wrapper`     | Teleport target node, `null` means no teleport | `null`  |

Overlay example: set `mask: true` and `wrapper: 'body'` to teleport the preview to body with a mask layer.

Use `body-close` to control whether clicking the image closes the preview (default `false`, not triggered after drag). Use `close-on-press-escape` to control whether pressing ESC closes the preview (default `true`).

### Error State

When an image URL is invalid or fails to load, the component automatically displays an error placeholder — showing an error icon and hint text, clickable to retry. Listen to the `error` event to execute custom logic on load failure (e.g., analytics reporting, fallback handling).

The `error` slot allows customizing the error placeholder content. Scope props include `activeIndex` (current index) and `src` (image URL) for context-aware rendering.

### With Figure

`OFigure` integrates `OImageViewer` internally — enable preview via the `preview` prop. Pass an object to `preview` to forward any `OImageViewer` props (e.g. `zoomRate`, `minScale`, `toolbar`). Use the `#preview-extra` slot to overlay custom content in the preview.

### Accessibility

- `focus-trap`: Enables focus trapping — Tab cycles within the component. Default `true`.
- All action buttons and navigation buttons have `aria-label`.
- Keyboard navigation: arrow keys to switch images / zoom, ESC to close.

### Custom Slots

| Slot       | Scope Props                                                             | Description                                                                                                                             |
| ---------- | ----------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `preview`  | `src`                                                                   | Custom preview content, replaces the default image viewer UI (e.g. video player), still benefits from OLayer's mask, close button, etc. |
| `default`  | —                                                                       | Rendered inside the image container, useful for overlaying custom content                                                               |
| `toolbar`  | `actions` / `prev` / `next` / `reset` / `activeIndex` / `setActiveItem` | Custom toolbar, call the provided methods for interaction                                                                               |
| `progress` | `activeIndex` / `total`                                                 | Custom progress indicator                                                                                                               |
| `error`    | `activeIndex` / `src`                                                   | Custom image load error display                                                                                                         |

### Functional API

In addition to template usage, `OImageViewer` provides a `useImageViewer` composable to imperatively manage preview from `setup`. The returned handle exposes a `visible` reactive ref alongside `open` / `close` / `unmount` methods:

```ts
import { ref } from 'vue';
import { useImageViewer } from '@opensig/opendesign';

const list = ref(['https://example.com/a.png']);
const { visible, open, close } = useImageViewer({
  previewList: list, // accept ref / getter / raw value
  currentIndex: 0,
  onClose: () => console.log('closed'),
});
open(); // open
list.value.push('b.png'); // the open preview updates reactively
close(); // close (autoDestroyOnClose defaults to false → toggles visible, reuses instance)
visible.value = true; // toggling the ref directly is equivalent to open()
```

Options accept `MaybeRefOrGetter` — value props (`previewList` / `currentIndex` / `zoomRate`, etc.) accept `ref` / `getter` / raw values, and changes to reactive sources are reflected live in the open preview. Event callbacks are plain functions, invoked directly when events fire.

`autoDestroyOnClose` controls whether the mounted instance is automatically destroyed on close: when `true`, `close()` unmounts the instance and releases the DOM — the next `open()` re-mounts; when `false`, it only toggles `visible`, keeping the instance for reuse. Defaults to `false` within an effect scope and `true` outside. When called within an effect scope, the host component's unmount automatically invokes `unmount()` to release the instance. When called outside an effect scope with `autoDestroyOnClose` set to `false`, the caller must manually invoke `unmount()` to release the DOM.

When called within a component's `setup`, `useImageViewer` automatically captures the current component's `appContext` and `provides`, allowing the mounted instance to access `OConfigProvider` injections, Pinia, Router, etc. When called within an effect scope but outside `setup` (e.g., manual `effectScope()`), the context cannot be captured and the mounted component may not be able to use `inject` — in this case, `unmount()` must be called manually for cleanup.

In functional mode, `layerOptions` defaults to `{ mask: true, maskClose: false, buttonClose: true, wrapper: null }`, matching the component scenario. Override via the `layerOptions` option. Supports all component props (except `visible`, managed internally) and event callbacks (`onClose` / `onSwitch` / `onRotate` / `onZoomDrag` / `onError`).

### crossorigin

The `crossorigin` prop sets the CORS attribute for images, supporting `'anonymous'`, `'use-credentials'`, and empty string (default, not set).

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
