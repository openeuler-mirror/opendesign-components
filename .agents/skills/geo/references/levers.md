# L1 杠杆清单(skill 在手工作知识)

> 审计组件后,对照本表找差距、排方案;某具体库的完整方案以其自己的方案文档为准。

> **目标简称(表中「服务」列用):**(a) 内容引用、(b) 代理可操作、(c) AI 编码工具认识组件。默认 a主b辅;L1 内常翻转为 b主a辅。

## L1 —— 烤进渲染产物(每个消费方自动受益)

| 杠杆                                                                                       | 服务               | 影响  | 成本  | 依据             |
| ------------------------------------------------------------------------------------------ | ------------------ | ----- | ----- | ---------------- |
| 语义宿主元素(`<button>`/`<input>`/`<textarea>`/`<select>`/`<nav>`/`<dialog>`,不用 `<div>`) | a 防御 + b         | 高    | 低-中 | WHATWG;APG       |
| 复合控件按 APG 给 ARIA 角色/状态(combobox/listbox/menu/dialog/grid/tab/tree)               | b                  | 高    | 中    | WAI-ARIA 1.2;APG |
| 把 `aria-label`/`aria-labelledby`/`aria-describedby` 作为组件 prop 暴露                    | b                  | 高    | 低    | WAI-ARIA         |
| 状态镜像:`aria-expanded`/`selected`/`disabled`/`checked`/`activedescendant`/`haspopup`     | b                  | 高    | 中    | APG              |
| 焦点管理(弹层/对话框 trap、列表 roving tabindex、方向键、关闭还原)                         | b                  | 中-高 | 中    | APG              |
| 布局组件给 landmark(`main`/`nav`/`aside`/`article`/`section`/`header`/`footer`)            | a 防御             | 中    | 低    | WHATWG §4.3      |
| 稳定 `data-*` 命名(`data-o-component`/`data-o-part`)                                       | b(仅读 DOM 的代理) | 低    | 低    | 弱,不进 a11y 树  |

## 不要做(明确排除)

- 不在组件内加 JSON-LD/schema.org —— Google 说对 AI Overviews 无益;组件不带页面级实体。
- 不把 `data-*` 当主杠杆 —— 不进无障碍树,弱信号。
- 不把 L1 当能独立交付 (a) —— 被消费方可抓取性 gate,那是 L3。
- 不在包内做 (c) 产物(`llms.txt` / 机器可读组件目录 JSON)——属“AI 编码工具用库开发”,非 (a)/(b);若用户另需,另开。

## 向后兼容风险(提方案必标)

- 加语义宿主元素 / ARIA 会改渲染 DOM 和消费方依赖的 CSS 钩子(对 v1.x 库是真实回归风险)。Phase 1 前需与用户确认可接受 churn。
- `<div>` → `<button>` 等替换可能影响:默认按钮 UA 样式、事件冒泡、focus 行为、现有 CSS 选择器(`.o-button` 套 `div` 的写法)。
- 新增 ARIA 角色/状态对屏幕阅读器是可见行为变化,需回归测试(建议用 Playwright MCP 无障碍快照做冒烟)。
