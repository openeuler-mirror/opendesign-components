# AGENTS.md

This file provides guidance to AI coding agents when working with code in this repository.

**重要:**

- **开发阶段速查：** 组件开发阶段 → `component-docs` | 日常编码/重构阶段 → `clean-code` | 版本发布阶段 → `release-note` | 测试用例 → `component-testing`。详细工作流指南见 [`packages/skills/README.md`](packages/skills/README.md)，当提及`since`等关键字时，必须查阅`component-docs`和`release-note`的相关内容。
- 你的所有回答应始终遵循`karpathy-guidelines`
- **代码质量要求：** 生成的代码必须满足 clean code 标准——函数职责单一、命名清晰、无冗余嵌套、参数不超过 3 个（超出则封装为对象）。详细规范参见 `clean-code` skill。
- **中文注释要求：** 所有新增或修改的代码必须附带完备的 JSDoc 格式中文注释，包括：`@description` 功能说明、`@param` 参数含义、`@returns` 返回值说明、关键逻辑的行内注释、复杂条件分支的解释。注释应准确、简洁，避免无意义的翻译式注释。注释应描述代码"当前是什么"及"为什么这样设计"，而非"之前存在什么问题、做了什么修复"——对历史问题的修复说明应写入 commit message，不得出现在代码注释中。
- **文档修改原则：** 对项目中的文档进行修改时，应以"融合"方式整合新内容，而非"补丁"式叠加——优先将新增内容自然融入原有结构与行文脉络，必要时重排章节、调整上下文衔接，保持文档的连贯性与整体性；禁止简单追加段落、堆砌附录，或留下"以下为新增"等拼接痕迹。
- **Bug 修复流程：** 修复任何 bug 前，必须遵循"测试先行"原则——先编写描述具体业务场景的测试用例，执行该用例并确认得到**失败的**测试结果，随后向用户确认用例场景与失败结果均真实可信，最后才进入修复阶段。严禁未经此流程直接修改代码。

## 仓库概览

基于 pnpm workspace 的 Vue 3 组件库 monorepo，各包职责独立：

| 包                      | 路径                  | 说明                                                         |
| ----------------------- | --------------------- | ------------------------------------------------------------ |
| `@opensig/opendesign`   | `packages/opendesign` | 发布的组件库 → [AGENTS.md](packages/opendesign/AGENTS.md)    |
| `@opensig/open-scripts` | `packages/scripts`    | 组件库专用构建 CLI → [AGENTS.md](packages/scripts/AGENTS.md) |
| `docs`                  | `packages/docs`       | 文档站 + 测试 → [AGENTS.md](packages/docs/AGENTS.md)         |
| `portal`                | `packages/portal`     | Portal 门户站点（无专属 AGENTS.md）                          |
| `skills`                | `packages/skills`     | AI agent skill 定义（非 npm 包，无专属 AGENTS.md）           |

### 子包依赖关系

各子包之间的内部依赖（`workspace:^`）和引用方式如下：

> 箭头方向：`A ──► B` 表示 **A 依赖 B**（A 引用了 B 的能力）

```
@opensig/open-scripts（独立包，无 workspace 依赖）
    ↑ opendesign / docs / portal 均以 devDep 依赖此包，
    │ opendesign 构建时调用 open-scripts 执行 build:component / build:style / gen:icon

@opensig/opendesign ──► @opensig/open-scripts（devDep，构建工具）
                    ──► @opensig/opendesign-token（devDep，CSS 变量源）

docs ──► @opensig/open-scripts（devDep，gen:icon 等脚本）
     ──► @opensig/opendesign（Vite alias → ../opendesign/src，非 workspace dep）
     ──► @opensig/opendesign-token（devDep，CSS 变量源）

portal ──► @opensig/opendesign（workspace dep + Vite alias → ../opendesign/src）
        ──► @opensig/open-scripts（devDep，gen:icon / gen:token）
        ──► @opensig/opendesign-token（devDep，CSS 变量源）
```

**关键说明：**

- **`@opensig/open-scripts`** 是最底层的独立包，无 workspace 依赖，仅通过 `catalog:` 引用外部构建工具（vite、svgo、sass-embedded 等）。`opendesign` 的 `build` 命令内部调用 `open-scripts build:component` 和 `open-scripts build:style`，因此修改 scripts 后需先执行 `pnpm -C packages/scripts build`，再重新构建 opendesign 方可生效。
- **`docs` 和 `portal`** 通过 Vite alias 直接引用 `@opensig/opendesign` 的源码（`../opendesign/src`），开发时修改组件源码可即时生效，无需重新构建组件库。
- **`@opensig/opendesign-token`** 是外部 CSS 变量定义包（通过 `catalog:css` 统一版本），非本仓库子包，所有需要 CSS token 的包均依赖此包。
- **构建顺序**：`scripts` → `opendesign` → `docs/portal`。完整初始化流程见 `docs:install` 命令。

依赖版本通过 `pnpm-workspace.yaml` 的 catalog 统一管理（`catalog:vue`、`catalog:css`、`catalog:build` 等），新增依赖应使用 `catalog:` 引用。

当运行任务需要安装包，要确定目标版本时：如果 `packages/docs` 或 `packages/portal` 中引用的包（如 nuxt等）出现新版本，且该包没有被 `packages/opendesign` 或 `packages/scripts` 引用，则可以在 `pnpm-workspace.yaml` 中升级该包版本。

## 根目录命令

```bash
pnpm docs:dev      # 启动文档站开发服务器（端口 3300）
pnpm docs:build    # 构建文档站
pnpm docs:install  # 完整初始化：install + 生成图标 + 生成 API 文档

# opendesign 组件库构建
pnpm -C packages/opendesign build
```

## CSS 变量规范

涉及 CSS 变量时，**优先使用 opendesign-token 中定义的变量**，不要自行定义或使用硬编码值：

1. 颜色变量：使用 `var(--o-color-*)` 系列（如 `--o-color-info1`, `--o-color-fill2`）
2. 尺寸变量：使用 `var(--o-icon_size-*)`, `var(--o-control_size-*)` 等
3. 圆角变量：使用 `var(--o-radius_control-*)` 等
4. 其他 token：优先在现有组件的 var.scss 中查找相似用法

例如：

- 背景色用 `--o-color-fill2` 而非 `--o-color-fill-2`
- 文字色用 `--o-color-info2-inverse`（反色）而非自定义颜色
- 圆角用 `--o-radius_control-m` 而非 `--o-radius-md`

### 组件级 CSS 变量命名

组件自身在 `var.scss` 中定义的 CSS 变量（opendesign-token 无法覆盖的场景），命名遵循以下规则：

- **公开变量**：使用组件缩写前缀，如 `--btn-*`（OButton）、`--tab-*`（OTab）、`--select-*`（OSelect）、`--slider-*`（OSlider）
- **内部变量**：不对外公开的变量在组件缩写前缀前加下划线 `--_` 前缀，如 `--_box-height`（OInput）、`--_vl-content-height`（OVirtualList）。这类变量通常由组件 JS 运行时通过内联 style 动态注入，`var.scss` 中仅声明默认回退值供 SSR 安全渲染，调用方不应覆盖。内部变量仍需在组件文档的 CSS 变量表中列出

示例（来自 `input/style/var.scss`）：

```scss
.o-input {
  --_box-padding-y: 0; // 内部变量，下划线前缀
  --_box-padding-x: 15px;
  --_box-height: var(--o-control_size-l);
}
```

示例（来自 `virtual-list/style/var.scss`）：

```scss
.o-virtual-list {
  --_vl-content-height: auto; // JS 动态注入，下划线前缀标记内部
  --_vl-offset-y: 0px;
}
```

## CSS 值优先级规则

### 1. 通用优先级（颜色、尺寸、圆角、字号、阴影、动画）

**优先级：仓库内现有变量 > opendesign-token > 硬编码**

- **仓库内现有变量**：先在同组件或其他组件的 `var.scss` 中查找相似用法（如 `--btn-height`, `--_box-height`）
- **opendesign-token**：使用 `var(--o-color-*)`, `var(--o-icon_size-*)`, `var(--o-radius_control-*)`, `var(--o-shadow-*)`, `var(--o-duration-*)`, `var(--o-easing-*)` 等
- **硬编码**：仅当前两者都不满足时使用

### 2. margin / padding 例外规则

margin、padding **不使用 opendesign-token**，直接使用硬编码值，然后在对应的 `media.scss` 中使用 `@include respond('断点')` 声明响应式。`__demo__`与`__docs__`中的示例除外，因为他们不是组件代码的一部分

允许的响应式断点（来自 `mixin.scss`）：

```
phone: (0, 600px)
>phone: 601px
pad: (601px, 1200px)
<=pad: (0, 1200px)
>pad: 1201px
pad_v: (601px, 840px)
<=pad_v: (0, 840px)
>pad_v: 841px
pad_h: (841px, 1200px)
laptop: (1201px, 1680px)
<=laptop: (0, 1680px)
>laptop: 1681px
pc: (1680px, 1920px)
>pc: 1921px
```

示例（来自 `ip-input/style/media.scss`）：

```scss
@include respond('<=laptop') {
  .o-ip-input {
    &.o_box-large {
      --_box-height: 36px;
    }
  }
}

@include respond('<=pad_v') {
  .o-ip-input {
    &.o_box-large {
      --_box-height: var(--o-control_size-l);
    }
  }
}
```

### 3. 字号规则

- font-size 和 line-height 通常**成对存在**
- 正确示例（来自 `_styles/common.scss`）：

```scss
.o-txt-text1 {
  font-size: var(--o-font_size-text1);
  line-height: var(--o-line_height-text1);
}
```

### 4. 响应式变量使用限制（重要）

- **packages/opendesign（组件库本身）**：禁止使用响应式变量（如 `--o-r-*`），只使用基础变量
- **packages/docs和**docs**目录下**：无此限制，可以使用响应式变量实现响应式排版

---

## AGENTS.md 层级规范

各子包 AGENTS.md **禁止重复** 本文件已定义的通用规则（CSS 变量、响应式断点等），仅通过引用链接指向本文件对应章节。

| 子包                  | 专属内容                                              |
| --------------------- | ----------------------------------------------------- |
| `packages/opendesign` | 组件内部规范、SSR兼容、实现范式、样式约定             |
| `packages/docs`       | 文档站构建、测试架构、Vite 插件                       |
| `packages/portal`     | Portal 站点路由、页面布局                             |
| `packages/scripts`    | CLI 构建命令（详细用法见 `opendesign-scripts` skill） |
| `packages/skills`     | AI agent skill 定义及工作流配置                       |
