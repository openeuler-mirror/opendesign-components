---
sidebar: OFigure 图片
kind: display
---

# OFigure 图片

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

### API

#### CSS 变量

| CSS 变量 | 描述 |
| --- | --- |
| \-\-figure-padding-top | `ratio` 值对应的图片高度占容器宽度的比例 |
| \-\-figure-fit | `fit` 属性对应的值（建议通过 `fit` 属性设置） |
| \-\-figure-position | 图片显示位置，用于给 `background-position` 或 `object-position` 属性赋值 |
| \-\-figure-radius | 图片圆角 |
| \-\-figure-error-color | 图片加载失败时的提示文案颜色 |
| \-\-figure-error-size | 图片加载失败时的提示文字大小或图标大小 |
| \-\-figure-play-icon-size | 播放图标大小 |

<!-- @api OFigure  -->
