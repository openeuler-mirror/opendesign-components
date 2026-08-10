---
sidebar: OImageViewer 图片预览 ^[NEXT](primary)
kind: display
---

# OImageViewer 图片预览

支持图片拖拽、缩放、旋转、多图切换的预览组件。组件内部持有 `OLayer`，通过 `v-model:visible` 控制预览显隐，通过 `layer-options` 配置遮罩层行为。可独立使用，也可搭配 `OFigure` 组件作为图片预览浮层。

## 示例

<!-- @case ImageViewerBasic -->
<!-- @case ImageViewerOversized -->
<!-- @case ImageViewerZoomBounds -->
<!-- @case ImageViewerStandalone -->
<!-- @case ImageViewerError -->
<!-- @case ImageViewerInFigure -->
<!-- @case ImageViewerFunctional -->

### 基本用法

通过 `preview-list` 传入图片地址数组即可渲染预览。支持滚轮缩放、鼠标拖拽、双指缩放、旋转等交互。图片默认展示原始大小，若超出屏幕范围则自动缩放至适屏，但允许放大到任意大小。

通过 `v-model:visible` 控制预览的显示与隐藏。`toolbar` 可自定义工具栏按钮的显示项和排列顺序，默认包含缩小、放大、重置、逆时针旋转、顺时针旋转和关闭；传 `false` 可隐藏整个操作区。此外，`layer-options.buttonClose` 可独立控制 OLayer 右上角的内建关闭按钮（默认渲染）。

通过 `infinite` 属性可开启无限循环切换。通过 `show-progress` 属性可显示图片切换进度指示器。

### 缩放与旋转

- `zoom-rate`：控制每次缩放的速率，值越大缩放越快，默认 `1.2`。
- `min-scale` / `max-scale`：限制用户手动缩放的范围，防止过度缩小或放大。当适屏缩放比例（containScale）低于 `min-scale` 时，有效下界自动扩展至 containScale，确保初始展示为完整可见的 contain 状态，且从该位置手动放大时平滑过渡，不会跳跃到 `min-scale`。
- `scale`：设置初始缩放比例，默认 `1`（原始大小）。图片加载后若超出屏幕会自动计算适屏缩放比例，重置时回到该比例。
- `show-zoom-ratio`：缩放时短暂显示当前缩放百分比，`duration` 控制提示持续时间（毫秒）。
- `scalable`：是否允许缩放图片，默认 `true`。设为 `false` 时，非移动端（具备 hover 且 fine pointer）缩放锁定为适屏比例，滚轮、键盘等缩放操作均被禁用；工具栏不展示缩放相关按钮（缩小、放大、重置），若过滤后仅剩 `close` 则隐藏整个操作区。移动端（触摸设备）仍允许双指缩放（自然手势）。
- `toolbar` 中的 `rotateLeft` / `rotateRight` 按钮分别逆时针 / 顺时针旋转 90°，旋转时触发 `rotate` 事件。

### 超屏幕图片适屏

当图片原始尺寸超出屏幕时，组件自动计算适屏缩放比例：统一缩放至整张可见（contain 模式，不超原始尺寸）。切换图片、点击重置按钮均回到该适屏比例。使用 4K 分辨率图片（3840×2160 横向 / 2160×3840 竖向）可直观观察适屏缩放效果，也可通过滚轮或双指放大至超出屏幕。

### 遮罩层配置

`OImageViewer` 内部持有 `OLayer`，通过 `layer-options` 配置遮罩层行为：

| 选项          | 说明                                      | 默认值  |
| ------------- | ----------------------------------------- | ------- |
| `mask`        | 是否渲染遮罩层                            | `true`  |
| `maskClose`   | 点击遮罩层是否关闭                        | `false` |
| `buttonClose` | 是否渲染右上角关闭按钮                    | `true`  |
| `wrapper`     | teleport 目标节点，`null` 表示不 teleport | `null`  |

遮罩层场景示例：设置 `mask: true`、`wrapper: 'body'` 将预览 teleport 到 body 并渲染遮罩层。

`body-close` 控制是否点击图片关闭预览（默认 `false`，拖拽后不触发）。`close-on-press-escape` 控制是否允许按 ESC 键关闭预览（默认 `true`）。

### 错误状态

当图片地址无效或加载失败时，组件自动展示错误占位——显示错误图标与提示文案，点击可重新加载。通过 `error` 事件可监听加载失败并执行自定义逻辑（如上报埋点、降级处理）。

`error` 插槽可自定义错误占位内容，作用域参数包含 `activeIndex`（当前索引）与 `src`（图片地址），便于根据上下文渲染差异化提示。

### 搭配 Figure

`OFigure` 内部已集成 `OImageViewer`，通过 `preview` 属性即可启用预览。`preview` 传对象时可直接透传 `OImageViewer` 的全部属性（如 `zoomRate`、`minScale`、`toolbar` 等）；也可通过 `#preview-extra` 插槽在预览中叠加自定义内容。

### 无障碍

- `focus-trap`：启用焦点陷阱，Tab 键在组件内循环聚焦，默认 `true`。
- 所有操作按钮和导航按钮均带 `aria-label`。
- 支持键盘导航：方向键切换图片 / 缩放，ESC 关闭。

### 自定义插槽

| 插槽       | 作用域参数                                                              | 说明                                                                                            |
| ---------- | ----------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `preview`  | `src`                                                                   | 自定义预览内容，替换默认的图片查看器 UI（如视频播放器），仍享有 OLayer 的遮罩层、关闭按钮等能力 |
| `default`  | —                                                                       | 渲染在图片容器内，可叠加自定义覆盖层                                                            |
| `toolbar`  | `actions` / `prev` / `next` / `reset` / `activeIndex` / `setActiveItem` | 自定义工具栏，可调用提供的方法实现交互                                                          |
| `progress` | `activeIndex` / `total`                                                 | 自定义图片切换进度指示器                                                                        |
| `error`    | `activeIndex` / `src`                                                   | 自定义图片加载失败提示                                                                          |

### 函数式调用

除模板声明外，`OImageViewer` 还提供 `useImageViewer` Composable，可在 `setup` 中命令式地管理预览。返回句柄包含 `visible` 响应式 ref 与 `open` / `close` / `unmount` 方法：

```ts
import { ref } from 'vue';
import { useImageViewer } from '@opensig/opendesign';

const list = ref(['https://example.com/a.png']);
const { visible, open, close } = useImageViewer({
  previewList: list, // 可传 ref / getter / 原始值
  currentIndex: 0,
  onClose: () => console.log('closed'),
});
open(); // 打开
list.value.push('b.png'); // 正在显示的预览会响应式更新
close(); // 关闭（autoDestroyOnClose 默认 false 时只切 visible，复用实例）
visible.value = true; // 也可直接操作 ref，等价于 open()
```

入参支持 `MaybeRefOrGetter`——值 props（`previewList` / `currentIndex` / `zoomRate` 等）可传 `ref` / `getter` / 原始值，源变化时正在显示的预览会响应式同步。事件回调为普通函数，在事件触发时直接调用。

`autoDestroyOnClose` 控制关闭时是否自动销毁挂载实例：`true` 时 `close()` 卸载实例并释放 DOM，下次 `open()` 重新挂载；`false` 时仅切换 `visible`，保留实例以便复用。默认值在 effect scope 内为 `false`，作用域外为 `true`。在 effect scope 内调用时，宿主组件销毁会自动调用 `unmount()` 释放挂载实例；在作用域外调用且 `autoDestroyOnClose` 为 `false` 时，需调用方手动调用 `unmount()` 以释放 DOM。

在组件 `setup` 中调用时，`useImageViewer` 会自动获取当前组件的 `appContext` 与 `provides`，让挂载实例能访问 `OConfigProvider` 注入、Pinia、Router 等。在 effect scope 内但非 `setup` 场景（如手动 `effectScope()`）调用时，上下文无法捕获，挂载的组件可能无法 inject——此时需手动调用 `unmount()` 清理。

函数式场景下 `layerOptions` 默认为 `{ mask: true, maskClose: false, buttonClose: true, wrapper: null }`，与组件场景一致，可通过传入 `layerOptions` 覆盖。支持全部组件 props（`visible` 除外，由 hook 内部维护）及事件回调（`onClose` / `onSwitch` / `onRotate` / `onZoomDrag` / `onError`）。

### crossorigin

`crossorigin` 属性设置图片的 CORS 属性，支持 `'anonymous'`、`'use-credentials'` 和空字符串（默认，不设置）。

## API

#### CSS 变量

| CSS 变量                                                | 描述                      |
| ------------------------------------------------------- | ------------------------- |
| \-\-image-viewer-ratio-width ^[NEXT](primary)           | 缩放比例提示框宽度        |
| \-\-image-viewer-ratio-height ^[NEXT](primary)          | 缩放比例提示框高度        |
| \-\-image-viewer-ratio-bgc ^[NEXT](primary)             | 缩放比例提示框背景色      |
| \-\-image-viewer-ratio-color ^[NEXT](primary)           | 缩放比例提示框文字颜色    |
| \-\-image-viewer-ratio-radius ^[NEXT](primary)          | 缩放比例提示框圆角        |
| \-\-image-viewer-ratio-backdrop-filter ^[NEXT](primary) | 缩放比例提示框背景模糊    |
| \-\-image-viewer-action-bottom ^[NEXT](primary)         | 操作区距底部偏移          |
| \-\-image-viewer-action-padding ^[NEXT](primary)        | 操作区内边距              |
| \-\-image-viewer-action-item-gap ^[NEXT](primary)       | 操作项间距                |
| \-\-image-viewer-action-bgc ^[NEXT](primary)            | 操作区背景色              |
| \-\-image-viewer-action-radius ^[NEXT](primary)         | 操作区圆角                |
| \-\-image-viewer-cursor-type ^[NEXT](primary)           | 拖拽时光标类型            |
| \-\-image-viewer-icon-color ^[NEXT](primary)            | 操作图标颜色              |
| \-\-image-viewer-icon-color-hover ^[NEXT](primary)      | 操作图标悬停颜色          |
| \-\-image-viewer-icon-size ^[NEXT](primary)             | 操作图标尺寸              |
| \-\-image-viewer-nav-size ^[NEXT](primary)              | 上一张/下一张按钮尺寸     |
| \-\-image-viewer-nav-color ^[NEXT](primary)             | 上一张/下一张按钮颜色     |
| \-\-image-viewer-nav-color-hover ^[NEXT](primary)       | 上一张/下一张按钮悬停颜色 |
| \-\-image-viewer-nav-color-disabled ^[NEXT](primary)    | 上一张/下一张按钮禁用颜色 |
| \-\-image-viewer-progress-color ^[NEXT](primary)        | 进度指示器文字颜色        |
| \-\-image-viewer-error-color ^[NEXT](primary)           | 图片加载错误提示颜色      |

<!-- @api OImageViewer  -->
