# 精确运行特定用例

> 用于：修复 bug 时只想跑某个用例 / 按文件或用例名过滤运行 / 不想每次都跑全量测试。

---

## 全量运行

所有命令默认在 `packages/opendesign` 目录下执行。

```bash
pnpm test            # watch 模式（监听文件变化自动重跑）
pnpm test:run        # 单次运行全部用例
pnpm test:ui         # Vitest UI 面板（可勾选用例交互运行）
pnpm test:cov        # 覆盖率
```

---

## 精确运行的四种方式

Vitest 原生支持多种用例过滤方式，**修复 bug 时只跑相关用例、回归时才跑全量**，无需修改任何配置。

### ① 按文件路径过滤（最常用）

直接把文件路径作为参数，不需要完整路径，能匹配即可：

```bash
# 单文件
pnpm vitest run --config vitest.config.ts src/<comp>/__tests__/OComp.index.test.ts

# 多文件（空格分隔）
pnpm vitest run src/<comp>/__tests__/OComp.index.test.ts src/<comp>/__tests__/OComp.responsive.test.ts

# 整个目录（推荐：跑通该组件所有相关用例）
pnpm vitest run src/<comp>/__tests__/

# 模糊匹配（Vitest 当作 glob 处理）
pnpm vitest run src/<comp>/__tests__/OComp.index
```

### ② 按用例名过滤（`-t` / `--testNamePattern`）

匹配 `it` / `describe` 的标题片段，支持正则：

```bash
# 只跑名字里含 "labelInValue" 的用例
pnpm test:run -- -t "labelInValue"

# 组合：指定文件 + 指定用例名（最精确，推荐）
pnpm vitest run src/<comp>/__tests__/OComp.render.test.ts -t "should render the placeholder"

# 正则匹配（前后加斜杠）
pnpm test:run -- -t "/placeholder|value$/"
```

> ⚠️ `-t` 是全局过滤，即使指定了文件也会在所有文件中按名字过滤，所以最好和文件路径一起用。

### ③ `it.only` / `describe.only`（临时调试）

在测试文件里把 `it` 改成 `it.only`，Vitest 只会跑这些用例：

```ts
describe('OComp render', () => {
  it.only('should render the placeholder', () => {
    // 只跑这一条
  });
  it('should render selected value', () => {
    // 被跳过
  });
});
```

> ⚠️ 这是临时手段，**修复完成后必须把 `.only` 去掉**，否则 CI 会漏跑用例。建议 commit 前用 `git diff` 自查。

### ④ UI 面板交互过滤

`pnpm test:ui` 启动后，在浏览器界面里按文件 / describe 分组勾选要跑的用例，适合反复跑单个失败用例调试时使用。

---

## 速查表

| 场景           | 命令                                                                         |
| -------------- | ---------------------------------------------------------------------------- |
| 只跑一个文件   | `pnpm vitest run src/<comp>/__tests__/OComp.render.test.ts`                  |
| 跑整个组件     | `pnpm vitest run src/<comp>/__tests__/`                                      |
| 按用例名跑     | `pnpm test:run -- -t "用例名片段"`                                           |
| 文件 + 用例名  | `pnpm vitest run src/<comp>/__tests__/OComp.render.test.ts -t "placeholder"` |
| 监听单文件     | `pnpm test src/<comp>/__tests__/OComp.render.test.ts`                        |
| 临时只跑某用例 | 文件内 `it` → `it.only`（commit 前务必移除）                                 |
| UI 面板勾选    | `pnpm test:ui`                                                               |
| 全量回归       | `pnpm test:run`                                                              |

---

## Bug 修复的运行节奏

结合根目录 AGENTS.md「测试先行」原则，修复期间的运行节奏按「单文件 → 组件目录 → 全量」逐步扩大范围：

```bash
# ① 写好描述该 bug 场景的测试用例（例如加到 OComp.render.test.ts）

# ② 只跑这一个文件，确认新用例失败（失败结果可复现 bug）
pnpm vitest run src/<comp>/__tests__/OComp.render.test.ts

# ③ 修复源码（OComp.vue / OChild.vue 等）

# ④ 再次只跑这一个文件，确认新用例通过
pnpm vitest run src/<comp>/__tests__/OComp.render.test.ts

# ⑤ 组件级回归：跑该组件整个 __tests__ 目录，确认修复未引入副作用
pnpm vitest run src/<comp>/__tests__/

# ⑥ 全量回归（可选，PR 前执行）
pnpm test:run
```

**核心原则**：确认失败结果时只跑特定用例（快速复现 bug），修复后逐步扩大范围，避免每次都跑全量浪费时间。

---

## 首次运行额外步骤

```bash
pnpm install
pnpm exec playwright install chromium
pnpm -C packages/opendesign build:style    # 产出 dist/index.css
```
