# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

**重要:**

- 本项目的从互联网下载的 AI 技能统一存放在：**.agents/skills/**
- 若你发现项目下有`skills-lock.json`但是没有找到`.agents/skills`，那你应该在项目根目录运行`pnpx skills experimental_install`以安装他们，然后再看问题中是否有命中的skills
- **项目开发专属 skill**（手动编写、随代码一起提交）存放在 **`packages/skills/`**，优先在此查找与本项目开发相关的指导，例如：
  - [`clean-code`](packages/skills/clean-code/SKILL.md)：代码质量诊断与重构指南，涉及 clean code、重构函数/模块、降低复杂度、消除嵌套、参数过多、函数体过长等话题时使用
- 你的所有回答应始终遵循`karpathy-guidelines`

## 仓库概览

基于 pnpm workspace 的 Vue 3 组件库 monorepo，各包职责独立：

| 包                      | 路径                  | 说明                                                         |
| ----------------------- | --------------------- | ------------------------------------------------------------ |
| `@opensig/opendesign`   | `packages/opendesign` | 发布的组件库 → [CLAUDE.md](packages/opendesign/CLAUDE.md)    |
| `@opensig/open-scripts` | `packages/scripts`    | 组件库专用构建 CLI → [CLAUDE.md](packages/scripts/CLAUDE.md) |
| `docs`                  | `packages/docs`       | 文档站 + 测试 → [CLAUDE.md](packages/docs/CLAUDE.md)         |

依赖版本通过 `pnpm-workspace.yaml` 的 catalog 统一管理（`catalog:vue`、`catalog:css`、`catalog:build` 等），新增依赖应使用 `catalog:` 引用。

当运行任务需要安装包，要确定目标版本时：如果 `packages/docs` 中引用的包（如 nuxt等）出现新版本，且该包没有被 `packages/opendesign` 或 `packages/scripts` 引用，则可以在 `pnpm-workspace.yaml` 中升级该包版本。

## 根目录命令

```bash
pnpm docs:dev      # 启动文档站开发服务器（端口 3300）
pnpm docs:build    # 构建文档站
pnpm docs:install  # 完整初始化：install + 生成图标 + 生成 API 文档
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

## CSS 值优先级规则

### 1. 通用优先级（颜色、尺寸、圆角、字号、阴影、动画）

**优先级：仓库内现有变量 > opendesign-token > 硬编码**

- **仓库内现有变量**：先在同组件或其他组件的 `var.scss` 中查找相似用法（如 `--btn-height`, `--_box-height`）
- **opendesign-token**：使用 `var(--o-color-*)`, `var(--o-icon_size-*)`, `var(--o-radius_control-*)`, `var(--o-shadow-*)`, `var(--o-duration-*)`, `var(--o-easing-*)` 等
- **硬编码**：仅当前两者都不满足时使用

### 2. margin / padding 例外规则

margin、padding **不使用 opendesign-token**，直接使用硬编码值，然后在对应的 `media.scss` 中使用 `@include respond('断点')` 声明响应式。

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
- \***\*docs**目录下\*\*：无此限制，可以使用响应式变量实现响应式排版

---

## CLAUDE.md 层级规范

各子包 CLAUDE.md **禁止重复** 本文件已定义的通用规则（CSS 变量、响应式断点等），仅通过引用链接指向本文件对应章节。

| 子包                  | 专属内容                                              |
| --------------------- | ----------------------------------------------------- |
| `packages/opendesign` | 组件内部规范、SSR兼容、实现范式、样式约定             |
| `packages/docs`       | 文档站构建、测试架构、Vite 插件                       |
| `packages/scripts`    | CLI 构建命令（详细用法见 `opendesign-scripts` skill） |
