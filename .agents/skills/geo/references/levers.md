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

## 内链 id 的生成与绑定(`aria-labelledby`/`aria-controls`/`aria-describedby` 的 id 从哪来)

ARIA 互链需要一个 id 锚点(触发器↔菜单、tab↔panel、label↔控件)。id 怎么来,看它绑在哪个元素上,只有两种情况:

| 情况                                                                                             | 做法                                                                                                                                      |
| ------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| id 绑在根元素上(模板里给根元素写了 `:id`)                                                        | `useAttrs().id` 优先,没传用 `useId()` 兜底,**不声明 `id` prop**。用户写的 `<Xxx id="foo">` 本来就会透传到根元素,读一下它,互链两侧就同源了 |
| id 要绑在非根元素上,或用户需要在自己的代码里引用它(`label for=`/`getElementById`/外部 aria 关联) | 声明 `id` prop,`props.id ?? useId()` 兜底,并在模板里手动绑定到目标元素                                                                    |

硬约束:

- 声明 `id` prop 后,Vue 不再把它透传到 DOM(prop 不进 `attrs`)——必须在模板里手动绑。忘绑 = DOM 上没有 id,静默失效,不报错。
- 兜底一律用 Vue ≥3.5 的 `useId()`(SSR 友好)。不要用 `Math.random()` 或模块级自增计数器:SSR 下会同页重复,且每次渲染变值。
- 读 attrs 用 `useAttrs()`,不要 `getCurrentInstance()?.attrs`(后者是逃生舱 API,拿 `uid`/`vnode` 这类东西才用)。
- 声明了 `id` prop 的,把派生规则(如 `` `${id}-nav` ``)写进 JSDoc 当契约;测试里加一条:用户传 id 时,互链两侧的 id 必须一致,不能被内部 useId 换掉。
- `aria-*` 属性默认靠 attrs 透传就够;只有组件要按内部状态增删改写时才声明为 prop(如 `aria-expanded` 跟着展开状态走)。

## 不要做(明确排除)

- 不在组件内加 JSON-LD/schema.org —— Google 说对 AI Overviews 无益;组件不带页面级实体。
- 不把 `data-*` 当主杠杆 —— 不进无障碍树,弱信号。
- 不把 L1 当能独立交付 (a) —— 被消费方可抓取性 gate,那是 L3。
- 不在包内做 (c) 产物(`llms.txt` / 机器可读组件目录 JSON)——属“AI 编码工具用库开发”,非 (a)/(b);若用户另需,另开。

## 向后兼容风险(提方案必标)

- 加语义宿主元素 / ARIA 会改渲染 DOM 和消费方依赖的 CSS 钩子(对 v1.x 库是真实回归风险)。Phase 1 前需与用户确认可接受 churn。
- `<div>` → `<button>` 等替换可能影响:默认按钮 UA 样式、事件冒泡、focus 行为、现有 CSS 选择器(`.o-button` 套 `div` 的写法)。
- 新增 ARIA 角色/状态对屏幕阅读器是可见行为变化,需回归测试(建议用 Playwright MCP 无障碍快照做冒烟)。
