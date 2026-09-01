---
sidebar: OTab 页签
kind: nav
---

# OTab 页签

## 示例

<!-- @usage TabUsage -->
<!-- @case ButtonTab -->
<!-- @case AddDel -->
<!-- @case CustomHead -->
<!-- @case AlignLeft -->
<!-- @case MobileOverflow -->
<!-- @case VModelInitial -->

> [!WARNING]
> **BREAKING CHANGE (v1.2.0)**：页签溢出交互重构，内部 DOM 结构发生变化。如果您通过 CSS 选择器依赖了内部 DOM 结构（如 `.o-tab-navs-container` 的子元素层级），请检查样式是否仍然生效。

## API

### CSS 变量

| CSS 变量                                                   | 描述                 |
| ---------------------------------------------------------- | -------------------- |
| \-\-tab-nav-btn-icon-size                                  | 按钮模式图标尺寸     |
| \-\-tab-nav-btn-size ^[1.2.0](primary)                     | 按钮模式按钮尺寸     |
| \-\-tab-nav-color                                          | 导航文字颜色         |
| \-\-tab-nav-color-hover                                    | 导航文字颜色(hover)  |
| \-\-tab-nav-color-active                                   | 导航文字颜色(激活)   |
| \-\-tab-nav-color-disabled                                 | 导航文字颜色(禁用)   |
| \-\-tab-nav-radius ^[1.2.0](primary)                       | 按钮模式圆角         |
| \-\-tab-nav-gap ^[1.2.0](primary)                          | 导航间距             |
| \-\-tab-nav-text-size ^[1.2.0](primary)                    | 导航文字大小         |
| \-\-tab-nav-text-height ^[1.2.0](primary)                  | 导航文字行高         |
| \-\-tab-nav-padding ^[1.2.0](primary)                      | 导航内边距           |
| \-\-tab-icon-color                                         | 图标颜色             |
| \-\-tab-icon-color-hover                                   | 图标颜色(hover)      |
| \-\-tab-icon-color-disabled                                | 图标颜色(禁用)       |
| \-\-tab-nav-divider                                        | 导航分隔线           |
| \-\-tab-nav-anchor-color                                   | 导航锚点颜色         |
| \-\-tab-nav-anchor-height                                  | 导航锚点高度         |
| \-\-tab-nav-close-size                                     | 关闭图标尺寸         |
| \-\-tab-nav-icon-size                                      | 导航图标尺寸         |
| \-\-tab-nav-icon-gap ^[1.2.0](primary)                     | 导航图标间距         |
| \-\-tab-nav-ellipsis-padding-x                             | 省略号内边距(水平)   |
| \-\-tab-nav-ellipsis-shadow-width ^[1.2.0](primary)        | 省略阴影宽度         |
| \-\-tab-nav-ellipsis-shadow-color ^[1.2.5-sp1](primary)    | 省略阴影颜色         |
| \-\-tab-nav-ellipsis-shadow-gradient ^[1.2.5-sp1](primary) | 省略阴影渐变         |
| \-\-tab-nav-bg-color ^[1.2.0](primary)                     | 按钮模式背景色       |
| \-\-tab-nav-bg-color-active ^[1.2.0](primary)              | 按钮模式背景色(激活) |
| \-\-tab-nav-active-border ^[1.2.0](primary)                | 按钮模式激活边框     |
| \-\-tab-nav-justify ^[1.2.0](primary)                      | 按钮模式排列方式     |
| \-\-tab-btn-radius ^[1.2.0](primary)                       | 按钮圆角(全局覆盖)   |

<!-- @api OTab -->
<!-- @api OTabPane -->
