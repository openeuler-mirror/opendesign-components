# 全局 CSS 工具类与 SCSS Mixin 速查

> **源码位置：** `packages/opendesign/src/_styles/`
> **入口文件：** `_styles/index.scss` → `_styles/index.ts`（`import './index.scss'`）

---

## 全局 CSS 工具类（`_styles/common.scss`）

### `.o-txt-{type}` — 文字排版

```scss
// 自动生成，type 取值见下表
.o-txt-{type} {
  font-size: var(--o-font_size-{type});
  line-height: var(--o-line_height-{type});
}
```

| type       | 用途         |
| ---------- | ------------ |
| display1~5 | 各级展示标题 |
| h1~h4      | 标题层级     |
| text1~2    | 正文         |
| tip1~2     | 提示文字     |

**使用示例：**

```html
<span class="o-txt-h2">标题</span>
<p class="o-txt-text1">正文内容</p>
```

### `.o-hide-scrollbar` — 隐藏滚动条

```scss
.o-hide-scrollbar {
  scrollbar-width: none; // Firefox
  &::-webkit-scrollbar {
    display: none; // Chrome / Safari / Edge
  }
}
```

**使用场景：** 需要隐藏滚动条但仍可滚动的容器（横向滚动列表、下拉面板等）。

### `.o-svg-icon` — SVG 图标基类

```scss
.o-svg-icon {
  --icon-g1: var(--o-color-info1); // 默认色
  --icon-g2: var(--o-color-primary1); // 次要色

  display: inline-block;
  width: 1em;
  height: 1em;
  vertical-align: -0.2em;
  color: inherit;
  font-style: normal;
  outline: none;
  &.type-stroke {
    stroke: currentColor;
  }
  &.type-fill {
    fill: currentColor;
  }
}
```

**使用场景：** 图标组件的根元素基类，提供统一的尺寸（1em）和颜色继承。子类通过 `type-stroke` / `type-fill` 切换描边或填充模式。

### `.o-sr-only` — 屏幕阅读器专用隐藏文本

```scss
.o-sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

**使用场景：** 将文本节点隐藏在视觉之外，但屏幕阅读器和爬虫仍可读取。典型用途：

- 表单控件（Select、DatePicker 等）选中值的 DOM 文本可读性
- 为纯图标按钮提供文本替代
- 为装饰性元素提供语义说明

**使用示例：**

```html
<div class="o-select">
  <!-- 屏幕阅读器读取选中值 -->
  <span class="o-sr-only" aria-hidden="false">{{ selectedLabel }}</span>
</div>
```

> **注意：** 此类为全局定义，禁止在组件内重复定义同名样式。组件内直接使用 `class="o-sr-only"` 即可，无需嵌套在组件根选择器下。

---

## 全局动画类（`_styles/animation.scss`）

### `.o-rotating` — 持续旋转

```scss
.o-rotating {
  animation: o-rotating var(--o-rotate-duration, 1s) var(--o-easing-linear) infinite;
}
```

**使用场景：** Loading 图标、刷新动画。

### Vue Transition 过渡类

以下类名遵循 Vue `<Transition>` 的 `enter-active` / `leave-active` 命名约定，通过 `name` 属性匹配：

| 类名                         | 动画效果           | duration          |
| ---------------------------- | ------------------ | ----------------- |
| `.o-zoom-fade-enter-active`  | 缩放 0.95→1 + 淡入 | `--o-duration-m1` |
| `.o-zoom-fade-leave-active`  | 缩放 1→0.95 + 淡出 | `--o-duration-s`  |
| `.o-zoom-fade2-enter-active` | 缩放 0.8→1 + 淡入  | `--o-duration-m1` |
| `.o-zoom-fade2-leave-active` | 缩放 1→0.8 + 淡出  | `--o-duration-s`  |
| `.o-fade-in-enter-active`    | 纯淡入             | `--o-duration-m1` |
| `.o-fade-in-leave-active`    | 纯淡出             | `--o-duration-m1` |
| `.o-fade-up-enter-active`    | 上滑 10px→0 + 淡入 | `--o-duration-m1` |
| `.o-fade-up-leave-active`    | 上滑 0→10px + 淡出 | `--o-duration-s`  |

**使用示例：**

```vue
<Transition name="o-zoom-fade">
  <div v-if="visible" key="content">...</div>
</Transition>
```

---

## 全局 SCSS Mixin（`_styles/mixin.scss`）

> `mixin.scss` 通过 Vite 全局注入（`additionalData`），组件 SCSS 中**无需手动 `@use`**，直接使用即可。

### `@include hover` — hover 设备检测

```scss
@include hover {
  &:hover {
    color: var(--select-color-hover);
  }
}
```

**等价于：** `@media (hover: hover) { &:hover { ... } }`

仅在不支持 hover 的设备上不会触发，避免移动端的「点击后悬停残留」问题。

### `@include respond('断点')` — 响应式媒体查询

```scss
@include respond('<=laptop') {
  .o-component {
    --_box-height: 36px;
  }
}
```

**可用断点：**

| 断点      | 范围         | 断点       | 范围          |
| --------- | ------------ | ---------- | ------------- |
| `phone`   | 0 – 600px    | `<=pad`    | 0 – 1200px    |
| `>phone`  | ≥ 601px      | `>pad`     | ≥ 1201px      |
| `pad`     | 601 – 1200px | `<=laptop` | 0 – 1680px    |
| `<=pad_v` | 0 – 840px    | `>laptop`  | ≥ 1681px      |
| `>pad_v`  | ≥ 841px      | `laptop`   | 1201 – 1680px |
| `pad_v`   | 601 – 840px  | `pc`       | 1681 – 1920px |
| `pad_h`   | 841 – 1200px | `>pc`      | ≥ 1921px      |

> 完整断点定义见 [根目录 AGENTS.md → CSS 值优先级规则](/AGENTS.md)。

### `@include x-svg-hover` — SVG 旋转关闭效果

```scss
.icon-arrow {
  @include x-svg-hover;
}
```

效果：hover 时内部 SVG 旋转 180°，带 `--o-duration-m1` 过渡。

### `@include hoverable($hover)` — 自定义 hover 媒体查询

```scss
@include hoverable('hover') {
  // 仅 hover 设备生效的内容
}
```

### `@include me-hover` — 同时输出基础与 hover 样式

```scss
@include me-hover {
  color: var(--select-color-hover);
}
```

等价于先输出一次内容（无 hover），再输出 `@media (hover: hover) { &:hover { ... } }`。

### 已废弃 Mixin

| Mixin                         | 状态           | 替代方案                        |
| ----------------------------- | -------------- | ------------------------------- |
| `@include respond-to('断点')` | **deprecated** | 使用 `@include respond('断点')` |
| `$breakpoints`                | **deprecated** | 使用 `$o-breakpoints`           |
