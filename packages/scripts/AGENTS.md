# packages/scripts AGENTS.md

`@opensig/open-scripts` 构建 CLI，供 `packages/opendesign` 调用。

**参考**：CLI 详细用法见 `opendesign-scripts` skill（`.agents/skills/opendesign-scripts/SKILL.md`）。

## 命令

```bash
pnpm build  # 构建 CLI 产物到 dist/index.mjs
pnpm dev    # watch 模式（开发调试用）
```

修改脚本逻辑后需先运行 `pnpm build`，再在 `packages/opendesign` 中使用。

## 提供的子命令

| 命令                           | 用途                                        |
| ------------------------------ | ------------------------------------------- |
| `open-scripts gen:icon`        | 将 SVG 转换为 Vue 图标组件                  |
| `open-scripts clean:svg`       | 清理优化 SVG 文件                           |
| `open-scripts build:component` | 构建组件库 ES/CJS（vite + vite-plugin-dts） |
| `open-scripts build:style`     | 编译组件库所有 SCSS                         |
| `open-scripts gen:token`       | 生成设计 Token CSS                          |
