---
name: global-utilities
description: 组件库全局资源发现与复用指南。当需要查找全局 CSS 工具类、SCSS mixin、TS 工具函数、内部 composable 或内部共享组件时触发。在编写新组件或新功能前，应先查阅此 skill 确认是否已有可复用的全局资源，避免重复实现。涉及 sr-only / o-sr-only、hide-scrollbar、svg-icon、z-index、getRoundClass、useFormField、ClientOnly、OPopup、InBox、debounce、throttleRAF 等已有工具时自动触发。
metadata:
  version: '1.0.0'
---

# 组件库全局资源发现与复用指南

> **核心原则：** 编写新代码前，先确认是否已有全局资源可复用。**禁止在组件内重复定义同类样式或重新实现同类逻辑。**

> **详细索引：**
>
> - **CSS 工具类 + SCSS Mixin** → [`references/css-classes.md`](references/css-classes.md)
> - **TS 工具函数 + Composable + 内部组件** → [`references/ts-utilities.md`](references/ts-utilities.md)

---

## 快速索引

| 你在找什么                         | 看哪个 reference | 对应源码目录                     |
| ---------------------------------- | ---------------- | -------------------------------- |
| 屏幕阅读器隐藏文本（sr-only）      | css-classes.md   | `_styles/common.scss`            |
| 隐藏滚动条                         | css-classes.md   | `_styles/common.scss`            |
| SVG 图标基类                       | css-classes.md   | `_styles/common.scss`            |
| 文字排版工具类                     | css-classes.md   | `_styles/common.scss`            |
| 动画过渡类（fade、zoom、rotating） | css-classes.md   | `_styles/animation.scss`         |
| 响应式媒体查询 mixin               | css-classes.md   | `_styles/mixin.scss`             |
| hover 设备检测 mixin               | css-classes.md   | `_styles/mixin.scss`             |
| 圆角 class 计算                    | ts-utilities.md  | `_utils/style-class.ts`          |
| z-index 分配                       | ts-utilities.md  | `_utils/z-index.ts`              |
| 防抖 / 节流                        | ts-utilities.md  | `_utils/helper.ts`               |
| 类型判断（isString、isObject…）    | ts-utilities.md  | `_utils/is.ts`                   |
| 键盘键值常量                       | ts-utilities.md  | `_utils/keycode.ts`              |
| DOM 工具（滚动父级、溢出检测…）    | ts-utilities.md  | `_utils/dom.ts`                  |
| VNode / Slot 工具                  | ts-utilities.md  | `_utils/vue-utils.ts`            |
| 全局图标 ref                       | ts-utilities.md  | `_utils/icons.ts`                |
| 唯一 id 生成                       | ts-utilities.md  | `_utils/unique-id.ts`            |
| 表单控件接入                       | ts-utilities.md  | `_composables/use-form-field.ts` |
| 上下文继承渲染                     | ts-utilities.md  | `_hooks/use-render-with-ctx.ts`  |
| 输入框视觉外壳                     | ts-utilities.md  | `_components/in-box`             |
| 纯文本输入逻辑                     | ts-utilities.md  | `_components/in-input`           |
| SSR 安全包裹                       | ts-utilities.md  | `_components/client-only.ts`     |
| 浮层容器                           | ts-utilities.md  | `popup/`                         |
| 提示气泡                           | ts-utilities.md  | `popover/`                       |

## 使用流程

1. **编码前**：根据上表或 reference 文档定位所需全局资源
2. **确认存在**：阅读 reference 确认 API 签名与适用场景
3. **直接引用**：从对应模块 import，不要复制粘贴实现到组件内
4. **不存在时**：确认无现成资源后再编写新代码，并评估是否应提取为全局资源

## 命名约定

- **全局 CSS 类**：以 `o-` 前缀开头（`.o-sr-only`、`.o-hide-scrollbar`、`.o-svg-icon`、`.o-rotating`）
- **全局 SCSS 变量**：以 `--o-` 前缀开头（`--o-color-*`、`--o-font_size-*`、`--o-radius_*`）
- **组件级 CSS 变量**：以组件缩写前缀开头（`--select-*`、`--btn-*`），内部变量加 `--_` 前缀（`--_box-height`）
- **全局 TS 函数**：小驼峰命名，从 `_utils/` 对应模块导出
- **全局 composable**：以 `use` 开头，从 `_composables/` 或 `_hooks/` 导出

## 维护规则（强制）

当发生以下任一变更时，**必须同步更新本 skill 及对应的 reference 文档**：

| 变更类型                                     | 需更新的文件                                              |
| -------------------------------------------- | --------------------------------------------------------- |
| 新增全局 CSS 工具类                          | `css-classes.md` + `SKILL.md` 快速索引表                  |
| 新增或修改全局 SCSS Mixin                    | `css-classes.md` + `SKILL.md` 快速索引表                  |
| 新增全局 TS 工具函数                         | `ts-utilities.md` + `SKILL.md` 快速索引表                 |
| 新增或修改全局 composable                    | `ts-utilities.md` + `SKILL.md` 快速索引表                 |
| 新增内部共享组件                             | `ts-utilities.md` + `SKILL.md` 快速索引表                 |
| 全局类名重命名（如 `sr-only` → `o-sr-only`） | `css-classes.md` + 所有引用该类名的组件源码 + 测试 + 文档 |
| 删除或废弃全局资源                           | 对应 reference 文档标注 deprecated + `SKILL.md` 索引移除  |

**审查检查点：** 当一个 PR 涉及 `_styles/`、`_utils/`、`_composables/`、`_hooks/` 或 `_components/` 目录的变更时，审查者应确认本 skill 是否已同步更新。未更新则视为 PR 不完整。
