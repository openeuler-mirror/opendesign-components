---
sidebar: OFigure 图片/视频
kind: display
---

# OFigure 图片/视频

## 示例

<!-- @usage FigureUsage -->
<!-- @case LoadError -->
<!-- @case HandlePreview -->
<!-- @case VideoPoster -->
<!-- @case CustomPlayIcon -->

### 卡片

- 通过 `title` 或 `content` 插槽可以渲染图片标题
- 通过 `default` 插槽可以渲染含有文案的卡片。

详见：[纯图卡片](/zh-CN/components/card#纯图卡片?_skin=a)

<!-- @case LazyLoad -->

### 图片预览

- `preview` 为 `true` 时点击图片打开预览，传对象时透传为 `OImageViewer` 的属性配置（如 `zoomRate`、`minScale`、`toolbar` 等）。
- `#preview` 插槽可替换整个预览 UI（如视频播放器），此时 `scalable` 自动设为 `false`——自定义预览内容不适用图片缩放交互。如需启用缩放，在 `preview` 对象中明确指定 `scalable: true` 即可。
- `#preview-extra` 插槽在预览图上叠加覆盖内容（如播放控制按钮）。
- `preview-close` 控制关闭方式：`'mask'`（点击遮罩）、`'button'`（关闭按钮）、`'body'`（点击图片）、`'none'`（禁用默认关闭，配合 `preview(false)` 手动关闭）。

<!-- @case HandlePreview -->

### API

#### CSS 变量

| CSS 变量                  | 描述                                                                     |
| ------------------------- | ------------------------------------------------------------------------ |
| \-\-figure-padding-top    | `ratio` 值对应的图片高度占容器宽度的比例                                 |
| \-\-figure-fit            | `fit` 属性对应的值（建议通过 `fit` 属性设置）                            |
| \-\-figure-position       | 图片显示位置，用于给 `background-position` 或 `object-position` 属性赋值 |
| \-\-figure-radius         | 图片圆角                                                                 |
| \-\-figure-error-color    | 图片加载失败时的提示文案颜色                                             |
| \-\-figure-error-size     | 图片加载失败时的提示文字大小或图标大小                                   |
| \-\-figure-play-icon-size | 播放图标大小                                                             |

<!-- @api OFigure  -->
