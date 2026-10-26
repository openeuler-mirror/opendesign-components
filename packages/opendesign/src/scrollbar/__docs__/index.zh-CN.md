---
sidebar: OScrollbar 滚动条
kind: operator
---

# 滚动条

替换浏览器原生滚动条，提供统一的视觉样式和交互体验。支持两种使用方式：

- **`OScroller`**：内置滚动条的容器组件，自动创建可滚动区域并关联滚动条
- **`OScrollbar`**：独立的滚动条组件，通过 `target` 属性关联任意外部滚动容器

此外还提供 `v-scrollbar` 指令和 `useScrollbar` 组合式函数，适应不同场景。

## 示例

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

### CSS 变量

| CSS 变量                            | 描述                     |
| ----------------------------------- | ------------------------ |
| \-\-scrollbar-delay                 | 滚动条显示延迟           |
| \-\-scrollbar-height                | 滚动条高度               |
| \-\-scrollbar-y-top                 | 垂直滚动条顶部偏移       |
| \-\-scrollbar-y-bottom              | 垂直滚动条底部偏移       |
| \-\-scrollbar-y-right               | 垂直滚动条右侧偏移       |
| \-\-scrollbar-y-left                | 垂直滚动条左侧偏移       |
| \-\-scrollbar-x-left                | 水平滚动条左侧偏移       |
| \-\-scrollbar-x-right               | 水平滚动条右侧偏移       |
| \-\-scrollbar-x-top                 | 水平滚动条顶部偏移       |
| \-\-scrollbar-x-bottom              | 水平滚动条底部偏移       |
| \-\-scrollbar-bg-color              | 滚动条背景色             |
| \-\-scrollbar-track-bg-color        | 滚动条轨道背景色         |
| \-\-scrollbar-track-width           | 滚动条轨道宽度           |
| \-\-scrollbar-thumb-bg-color        | 滚动条滑块背景色         |
| \-\-scrollbar-thumb-bg-color-hover  | 滚动条滑块背景色(hover)  |
| \-\-scrollbar-thumb-bg-color-active | 滚动条滑块背景色(active) |
| \-\-scrollbar-thumb-width           | 滚动条滑块宽度           |
| \-\-scrollbar-thumb-width-hover     | 滚动条滑块宽度(hover)    |
| \-\-scrollbar-thumb-radius          | 滚动条滑块圆角           |
| \-\-scrollbar-width                 | 滚动条容器宽度           |
| \-\-scrollbar-thumb-min-size        | 滚动条滑块最小尺寸       |

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
