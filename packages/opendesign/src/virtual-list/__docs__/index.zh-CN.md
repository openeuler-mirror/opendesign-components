---
sidebar: OVirtualList 虚拟滚动
kind: container
---

# 虚拟滚动

OVirtualList 是大数据量列表的虚拟滚动容器，仅渲染可视区域及前后缓冲区的 DOM 节点，支持垂直与水平两种布局方向。

## 何时使用

当列表数据量较大（通常超过数百条）且直接渲染会导致明显卡顿时使用。数据量较小时可通过 `threshold` 属性自动降级为全量渲染，避免虚拟化开销。

## 高度模式选择

通过 `itemSize` 属性区分三种高度模式：

| 模式                       | `itemSize` 传值           | 适用场景                     | 精度                 |
| -------------------------- | ------------------------- | ---------------------------- | -------------------- |
| 定高                       | `number`                  | 每项高度一致且已知           | 精确                 |
| 按项定高 ^[1.2.6](primary) | `(item, index) => number` | 每项高度不一致但可由函数计算 | 精确                 |
| 不定高                     | 不传                      | 高度在渲染时才确定           | 运行时测量，逐步逼近 |

不定高模式下，组件先用 `defaultItemSize` 估算总高度并渲染初始屏，随后通过 `ResizeObserver` 测量真实高度并修正滚动位置。建议为每一项传入唯一 `id` 字段——动态追加数据时组件依赖 `id` 定位当前可视项，缺失 `id` 可能导致滚动位置跳变。

## 编程式滚动

组件通过 `ref` 暴露两个方法：

- `scrollToView(index, align?, behavior?)`：将指定索引项滚动到视口内。`align` 支持 `'start'` / `'end'` / `'center'` / `'nearest'` / `number`（偏移像素）。不定高模式下若目标项尚未测量，会先以 `start` 对齐触发渲染，测量后通过"二次逼近"^[1.2.6](primary)重新定位。
- `scrollToOffset(px)` ^[1.2.6](primary)：直接滚动到指定像素偏移量，自动 clamp 到合法范围。

## SSR 兼容

组件在 SSR 环境下以 `defaultItemSize` / `itemSize` 估算初始尺寸并安全渲染，不会访问浏览器 API。客户端 hydration 后通过 `ResizeObserver` 测量并修正。

## 示例

<!-- @usage VirtualListUsage -->
<!-- @case VirtualListBasic -->
<!-- @case VirtualListAPI -->
<!-- @case VirtualListDynamic -->
<!-- @case VirtualListLayout -->
<!-- @case VirtualListThreshold -->
<!-- @case VirtualListStartIndex -->

## CSS 变量

以下变量带 `_` 前缀，为组件内部变量，由 JS 运行时通过内联 style 动态注入，控制虚拟滚动的尺寸和偏移。默认回退值仅在 JS 未执行（如 SSR 首屏）时生效，调用方不应覆盖。

| CSS 变量                                 | 默认值 | 描述                                                                             |
| ---------------------------------------- | ------ | -------------------------------------------------------------------------------- |
| \-\-\_vl-content-height                  | auto   | 垂直模式下的内容总高度（由 JS 根据 `itemSize` × `list.length` 或运行时测量计算） |
| \-\-\_vl-content-width ^[1.2.6](primary) | auto   | 水平模式下的内容总宽度                                                           |
| \-\-\_vl-offset-y ^[1.2.6](primary)      | 0px    | 垂直模式下渲染列表的 Y 轴 transform 偏移                                         |
| \-\-\_vl-offset-x ^[1.2.6](primary)      | 0px    | 水平模式下渲染列表的 X 轴 transform 偏移                                         |

## Api

<!-- @api OVirtualList -->
