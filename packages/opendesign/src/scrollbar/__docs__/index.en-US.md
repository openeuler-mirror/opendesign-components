---
sidebar: OScrollbar
kind: operator
---

# Scroll bar

Replaces the native browser scrollbar with unified visual styles and interaction. Two usage modes are available:

- **`OScroller`**: A container component with built-in scrollbar that automatically creates a scrollable area and associates a scrollbar
- **`OScrollbar`**: A standalone scrollbar component that associates with any external scroll container via the `target` prop

Additionally, the `v-scrollbar` directive and `useScrollbar` composable are provided for different scenarios.

## Demo

<!-- @usage ScrollbarUsage -->
<!-- @case:a|k|e ScrollbarH -->
<!-- @case:a|k|e ScrollbarV -->
<!-- @case:a|k|e ScrollbarScroller -->
<!-- @case:a|k|e ScrollbarTarget -->
<!-- @case:a|k|e ScrollbarDynamic -->
<!-- @case:a|k|e ScrollbarCustom -->
<!-- @case:a|k|e ScrollbarDirective -->
<!-- @case:a|k|e ScrollbarHook -->

## API

### CSS Variables

| CSS Variable                        | Description                               |
| ----------------------------------- | ----------------------------------------- |
| \-\-scrollbar-delay                 | Scrollbar display delay                   |
| \-\-scrollbar-height                | Scrollbar height                          |
| \-\-scrollbar-y-top                 | Vertical scrollbar top offset             |
| \-\-scrollbar-y-bottom              | Vertical scrollbar bottom offset          |
| \-\-scrollbar-y-right               | Vertical scrollbar right offset           |
| \-\-scrollbar-y-left                | Vertical scrollbar left offset            |
| \-\-scrollbar-x-left                | Horizontal scrollbar left offset          |
| \-\-scrollbar-x-right               | Horizontal scrollbar right offset         |
| \-\-scrollbar-x-top                 | Horizontal scrollbar top offset           |
| \-\-scrollbar-x-bottom              | Horizontal scrollbar bottom offset        |
| \-\-scrollbar-bg-color              | Scrollbar background color                |
| \-\-scrollbar-track-bg-color        | Scrollbar track background color          |
| \-\-scrollbar-track-width           | Scrollbar track width                     |
| \-\-scrollbar-thumb-bg-color        | Scrollbar thumb background color          |
| \-\-scrollbar-thumb-bg-color-hover  | Scrollbar thumb background color (hover)  |
| \-\-scrollbar-thumb-bg-color-active | Scrollbar thumb background color (active) |
| \-\-scrollbar-thumb-width           | Scrollbar thumb width                     |
| \-\-scrollbar-thumb-width-hover     | Scrollbar thumb width (hover)             |
| \-\-scrollbar-thumb-radius          | Scrollbar thumb border radius             |
| \-\-scrollbar-width                 | Scrollbar container width                 |
| \-\-scrollbar-thumb-min-size        | Scrollbar thumb minimum size              |

### useScrollbar

```ts:line-numbers
function useScrollbar(options: {
  target: Ref<string | ComponentPublicInstance | HTMLElement | null> | HTMLElement | string;
  wrapper?: Ref<string | ComponentPublicInstance | HTMLElement | null> | HTMLElement | string;
  disabledX?: boolean;
  disabledY?: boolean;
  duration?: number;
  showType?: 'auto' | 'always' | 'hover' | 'never';
  size?: 'medium' | 'small';
  barClass?: string | { [k: string]: boolean } | (string | { [k: string]: boolean })[];
  autoUpdateOnScrollSize?: boolean;
}): { scrollbar: OScrollbar | null; unmount: () => void };
```

### vScrollbar

```ts:line-numbers
const vScrollbar: ObjectDirective<HTMLElement, false | Partial<BaseScrollerPropsT>>;
```

<!-- @api OScrollbar -->
<!-- @api OScroller -->
