---
sidebar: OVirtualList
kind: container
---

# Virtual List

OVirtualList is a virtual scrolling container for large lists. It only renders the DOM nodes within the visible area and a configurable buffer, supporting both vertical and horizontal layouts.

## When to Use

Use when the list data is large (typically hundreds of items or more) and direct rendering causes noticeable lag. For smaller datasets, the `threshold` prop can automatically fall back to full rendering to avoid virtualization overhead.

## Height Mode Selection

Three height modes are distinguished by the `itemSize` prop:

| Mode                              | `itemSize` value          | Use case                                    | Accuracy                               |
| --------------------------------- | ------------------------- | ------------------------------------------- | -------------------------------------- |
| Fixed height                      | `number`                  | All items have the same known height        | Exact                                  |
| Per-item height ^[1.2.6](primary) | `(item, index) => number` | Items have different but computable heights | Exact                                  |
| Dynamic height                    | omitted                   | Heights are only known after rendering      | Measured at runtime, gradually refined |

In dynamic-height mode, the component first estimates total height using `defaultItemSize` and renders the initial screen, then measures real heights via `ResizeObserver` and corrects the scroll position. It is recommended to provide a unique `id` field for each item — the component relies on `id` to locate the current visible item during dynamic data insertion; missing `id` may cause scroll position jumps.

## Programmatic Scrolling

Two methods are exposed via `ref`:

- `scrollToView(index, align?, behavior?)`: Scrolls the item at the given index into view. `align` supports `'start'` / `'end'` / `'center'` / `'nearest'` / `number` (pixel offset). In dynamic-height mode, if the target item is not yet measured, it first aligns to `start` to trigger rendering, then re-positions via a "two-pass approach" ^[1.2.6](primary) after measurement.
- `scrollToOffset(px)` ^[1.2.6](primary): Scrolls directly to the specified pixel offset, automatically clamped to the valid range.

## SSR Compatibility

In SSR environments, the component estimates initial dimensions using `defaultItemSize` / `itemSize` and renders safely without accessing browser APIs. After client-side hydration, it measures and corrects via `ResizeObserver`.

## Demo

<!-- @usage VirtualListUsage -->
<!-- @case VirtualListBasic -->
<!-- @case VirtualListAPI -->
<!-- @case VirtualListDynamic -->
<!-- @case VirtualListLayout -->
<!-- @case VirtualListThreshold -->
<!-- @case VirtualListStartIndex -->

## CSS Variables

The following variables are prefixed with `_` to indicate they are internal to the component. They are dynamically injected by JS at runtime via inline styles to control virtual scrolling dimensions and offsets. The default fallback values only take effect when JS has not executed (e.g., SSR first paint); consumers should not override them.

| CSS Variable                             | Default | Description                                                                                                     |
| ---------------------------------------- | ------- | --------------------------------------------------------------------------------------------------------------- |
| \-\-\_vl-content-height                  | auto    | Total content height in vertical mode (calculated by JS from `itemSize` × `list.length` or runtime measurement) |
| \-\-\_vl-content-width ^[1.2.6](primary) | auto    | Total content width in horizontal mode                                                                          |
| \-\-\_vl-offset-y ^[1.2.6](primary)      | 0px     | Y-axis transform offset of the render list in vertical mode                                                     |
| \-\-\_vl-offset-x ^[1.2.6](primary)      | 0px     | X-axis transform offset of the render list in horizontal mode                                                   |

## Api

<!-- @api OVirtualList -->
