---
sidebar: OTour 漫游引导 ^[NEXT](primary)
kind: nav
---

# 漫游引导

## 示例

<!-- @usage TourUsage -->
<!-- @case TourNonModal -->
<!-- @case TourCenter -->

## 响应式

当视口宽度 ≤ 840px（phone / pad_v 断点）时，OTour 不渲染引导卡片与遮罩，避免在小屏设备上遮挡内容；视口回到 > 840px 后自动恢复展示。该行为由组件内置断点检测驱动，无需额外配置。

## 行为说明

### 键盘导航

引导卡片显示期间，按 **←**（左箭头）返回上一步，按 **→**（右箭头）进入下一步。当焦点位于 `input`、`textarea`、`select` 或 `contentEditable` 元素内时，方向键保留给文本编辑，不触发步骤切换。

### 关闭后重置步骤

Tour 关闭（`visible` 切为 `false`）时，`current` 自动重置为 `0`，下次打开从第一步开始。如需保持步骤位置，请在 `close` / `finish` 事件中保存当前步骤索引，下次打开时通过 `v-model:current` 恢复。

### 自动关闭

在最后一步点击"下一步"时，组件派发 `finish` 事件并自动将 `visible` 设为 `false`。按 `ESC` 键关闭时（`closeOnPressEscape=true`，默认开启），组件派发 `close` 事件并携带当前步骤索引。

### 按钮回调调用时序

`prevButtonProps.onClick` / `nextButtonProps.onClick` 在步骤切换**完成后**调用，不能用于阻止切换。若需在切换前拦截（如校验），请改用 `v-model:current` + `watch` 自行控制。

### 遮罩 body class

当遮罩启用（`mask=true`，默认）且 Tour 可见时，`<body>` 会添加 `o-tour-open` class；关闭后移除。可利用此 class 实现锁定滚动等自定义样式：

```css
body.o-tour-open {
  overflow: hidden;
}
```

## API

### CSS 变量

| CSS 变量                    | 描述                                                                |
| --------------------------- | ------------------------------------------------------------------- |
| \-\-tour-width              | 引导卡片宽度                                                        |
| \-\-tour-radius             | 引导卡片圆角                                                        |
| \-\-tour-padding            | 引导卡片内边距                                                      |
| \-\-tour-bg-color           | 引导卡片背景色                                                      |
| \-\-tour-shadow             | 引导卡片阴影                                                        |
| \-\-tour-title-size         | 标题字号                                                            |
| \-\-tour-title-height       | 标题行高                                                            |
| \-\-tour-title-color        | 标题颜色                                                            |
| \-\-tour-title-weight       | 标题字重                                                            |
| \-\-tour-detail-size        | 详情字号                                                            |
| \-\-tour-detail-height      | 详情行高                                                            |
| \-\-tour-detail-color       | 详情文字颜色                                                        |
| \-\-tour-detail-gap         | 详情与标题间距                                                      |
| \-\-tour-footer-gap         | 底部区域间距                                                        |
| \-\-tour-btn-gap            | 按钮间距                                                            |
| \-\-tour-indicators-size    | 指示器字号                                                          |
| \-\-tour-indicators-height  | 指示器行高                                                          |
| \-\-tour-indicators-color   | 指示器颜色                                                          |
| \-\-tour-close-size         | 关闭按钮尺寸                                                        |
| \-\-tour-close-color        | 关闭按钮颜色                                                        |
| \-\-tour-close-color-hover  | 关闭按钮 hover 颜色                                                 |
| \-\-tour-close-color-active | 关闭按钮 active 颜色                                                |
| \-\-tour-close-img-size     | 图片模式关闭按钮尺寸                                                |
| \-\-tour-close-img-bg       | 图片模式关闭按钮背景色                                              |
| \-\-tour-mask-fill          | 遮罩填充色                                                          |
| \-\-popup-bd                | 弹层边框（Tour 覆盖 OPopup 默认值）                                 |
| \-\-popup-bg-color          | 弹层背景色（Tour 覆盖 OPopup 默认值）                               |
| \-\-\_tour-anchor-bg        | 箭头背景色（取自图片像素，内部变量，默认回退到 \-\-popup-bg-color） |

<!-- @api OTour -->
<!-- @api OTourStep -->
