# **tests** 目录说明

> 测试方法论（静态契约、动态契约、命名规范、视觉断言策略、响应式视口、SSR 水合、踩坑速查、组件档位、新组件接入、框架边界等）统一在 [component-testing SKILL](../../skills/component-testing/SKILL.md) 及其 [references/](../../skills/component-testing/references/)。

## 目录结构

```
packages/opendesign/__tests__/   ← 本文件夹
├── setup.ts                     ← Browser Mode 启动前自动执行（加载 dist/index.css + e.light/e.dark token）
├── _helpers/
│   ├── viewport.ts              ← setViewport / BREAKPOINTS
│   ├── ssr.ts                   ← renderSSR / ssrThenHydrate / spyHydrationErrors
│   ├── theme.ts                 ← THEMES / paintThemed / isTransparent
│   └── dom.ts                   ← flush / resolveTokenPx
└── README.md                    ← 本文件
```

各组件测试 co-located 在 `src/<comp>/__tests__/`，详见 SKILL「三个测试文件职责」。

## 索引

| 主题                                                         | 位置                                                                                                            |
| ------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------- |
| 运行命令 / 首次步骤                                          | SKILL → [命令](../../skills/component-testing/SKILL.md#命令)                                                    |
| 共享 helper 详细说明                                         | SKILL → [共享 helper 索引](../../skills/component-testing/SKILL.md#共享-helper-索引)                            |
| 测试 import 源码而非构建产物                                 | SKILL → [测试 import 策略](../../skills/component-testing/SKILL.md#测试-import-策略)                            |
| 覆盖率（计算原理 / 指标含义 / 覆盖范围 / 产出物 / 查看方式） | SKILL → [覆盖率](../../skills/component-testing/SKILL.md#覆盖率)                                                |
| 覆盖率配置 include/exclude                                   | [`vitest.config.ts`](../vitest.config.ts) 的 `coverage.include` / `coverage.exclude`                            |
| CI 集成                                                      | SKILL → [CI 集成](../../skills/component-testing/SKILL.md#ci-集成)                                              |
| 三文件职责 / 骨架代码                                        | SKILL → references/[three-file-structure.md](../../skills/component-testing/references/three-file-structure.md) |
| 视觉断言策略 / 双主题                                        | SKILL → references/[visual-contract.md](../../skills/component-testing/references/visual-contract.md)           |
| 踩坑速查 / L0~L3 排查                                        | SKILL → references/[pitfalls.md](../../skills/component-testing/references/pitfalls.md)                         |
| 框架边界 / 不支持的测试类型                                  | SKILL → [框架边界](../../skills/component-testing/SKILL.md#框架边界本框架不支持的测试类型)                      |
