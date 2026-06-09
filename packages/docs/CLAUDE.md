# packages/docs CLAUDE.md

文档站 + 组件库测试包（private）。

**依赖**：根目录 CLAUDE.md 的项目概览、命令、CSS 变量规范。

## 命令

```bash
pnpm dev           # 启动文档开发服务器
pnpm build         # 构建文档站
pnpm gen:api       # 重新生成组件 API 文档
pnpm gen:icon      # 生成文档站图标

# 测试
pnpm test          # Browser Mode 监听（Chromium/Playwright）
pnpm test:run      # Browser Mode 单次运行
pnpm test:ssr      # SSR/Node 环境监听
pnpm test:run:ssr  # SSR/Node 单次运行
pnpm test:ui       # Browser Mode + Vitest UI 面板

# 运行单个测试文件
pnpm vitest run --config vitest.config.ts __tests__/date-picker/ODatePicker/ODatePicker.index.test.ts
```

## 文档站构建流程

文档站通过一套 Vite 插件管线将组件源码中的 `__docs__/` 内容自动转换为文档页面：

```
组件 __docs__/index.zh-CN.md
  → generateComponentRouter   自动生成路由 src/router/components.ts
  → injectDemoAndApi           <!-- @case/usage/api --> 注释 → 组件 import
  → injectDemoDocs             <docs lang="md"> 自定义块 → 虚拟模块
  → injectDemoSource           __case__/*.vue 源码 → DemoSource 属性
  → vueMdTranslate             Markdown → Vue SFC（含代码高亮、表格、链接等）
```

### Vite 插件（`plugins/`）

| 插件      | 文件                         | 职责                                                                     |
| --------- | ---------------------------- | ------------------------------------------------------------------------ |
| 路由生成  | `generateComponentRouter.ts` | 扫描 `__docs__/index.*.md` frontmatter，生成 `src/router/components.ts`  |
| Demo 注入 | `injectDemoAndApi.ts`        | `<!-- @case/usage/api -->` 替换为组件 import；处理 `<docs>` 块多语言拆分 |
| Docs 块   | `injectDemoDocs.ts`          | `<docs lang="md">` → 虚拟模块，挂载到 `_sfc_main.__docs`                 |
| 源码注入  | `injectDemoSource.ts`        | `__case__/*.vue` 源码提取 → 挂载到 `_sfc_main.DemoSource`                |
| Markdown  | `plugins/markdown/`          | 代码高亮（Shiki）、行号、链接替换、表格样式、自定义 `^[]()` popover 语法 |

### 行内注解标签

文档中支持 `^[内容](颜色)`tooltip``行内注解语法，渲染为`OTag`或`OPopover`+`OTag`。语法详细说明见 `component-docs` skill 的 [`doc-pages.md`](../../skills/component-docs/references/doc-pages.md)，管线机制见 [`pipeline.md`](../../skills/component-docs/references/pipeline.md)。涉及模块：

| 模块                           | 职责                                                                                                          |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------- |
| `shared/inlineTagConstants.ts` | 共享常量：正则 `TAG_REG_EXP`、颜色类型 `TagColor`、间距 `TAG_INLINE_MARGIN_LEFT`                              |
| `plugins/markdown/popover.ts`  | Markdown-it 插件：`^[]()` 语法 → HTML（`<OTag>`/`<OPopover>`），写入 `data-annotation-*` 属性供运行时反向提取 |
| `src/utils/inlineTag.ts`       | `renderInlineTagContent()`：文本 → VNode（运行时渲染，用于侧边栏、锚点等非 Markdown 场景）                    |
| `src/utils/getHeads.ts`        | `extractTitleWithTags()`：从 DOM `data-annotation-*` 属性还原 `^[]()` 语法，供锚点组件显示注解标签            |

### 脚本（`scripts/`）

**`generateApi.ts`**（`pnpm gen:api` 调用）：基于 `vue-component-meta` + `vue-docgen-api` 解析组件 props/events/slots/expose，自动生成 `__docs__/{ComponentName}-api.{zh-CN|en-US}.md`。

- 支持 JSDoc 注解标签（`@since`、`@deprecated`、`@experimental`），在 API 表格名称列渲染为 `^[]()` 语法
- 支持 `@zh-CN`/`@en-US` JSDoc 标签，用于说明列本地化描述
- `ANNOTATION_TAG_DEFS` 定义注解标签的颜色与显示模式：`since`→`(primary)` 显示文本、`deprecated`→`(danger)` 显示标签名、`experimental`→`(warning)` 显示标签名

**`parseSlotsAndExpose.ts`**：基于 `ts-morph` 解析 `defineSlots`、`defineExpose`、`defineEmits`，提取 JSDoc 标签（`tags`）。`defineExpose` 对象字面量内的 JSDoc 因 ts-morph 剥离问题，使用 `parseExposeJSDocFromRaw()` 从原始文本提取。

**修改组件 props 后需重新运行 `pnpm gen:api`。**

## 文档站共享模块

### 共享常量（`shared/`）

| 文件                    | 职责                                                                                                                         |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `inlineTagConstants.ts` | 行内注解标签的共享常量：正则 `TAG_REG_EXP`、颜色类型 `TagColor`、间距 `TAG_INLINE_MARGIN_LEFT`，供 Markdown 插件与运行时共用 |

### 组件（`src/components/`）

| 组件                   | 职责                                                                                  |
| ---------------------- | ------------------------------------------------------------------------------------- |
| `DemoContainer.vue`    | Demo 展示容器：渲染 `__docs__` 说明文字 + demo 预览 + 代码展开按钮                    |
| `DemoUsage.vue`        | 交互式 Usage Demo：根据 `schema` 自动生成表单控件，动态编译并实时预览模板             |
| `CodeContainer.vue`    | 代码块展示：含复制按钮、语言标签、行号、语法高亮（接收 base64 编码内容）              |
| `DocConfigProvide.vue` | 向子树注入 `docs-config` context，控制代码展开等共享状态                              |
| `DocLink.vue`          | 文档链接组件：自动识别外链并添加 `target=_blank`、外链图标                            |
| `OperatorView.ts`      | 表单控件组件：根据 `schema` 类型自动生成 Checkbox/Select/Input/Radio 等               |
| `RecursiveMenu.ts`     | 递归菜单组件：根据 `NavItem` 渲染 `OSubMenu`/`OMenuItem`，label 支持 `^[]()` 注解语法 |
| `TheAnchor.ts`         | 锚点导航组件：从标题结构渲染 `OAnchorItem` 树，title 支持 `^[]()` 注解语法            |
| `TheAside.vue`         | 侧边栏组件：搜索过滤 + `RecursiveMenu` 渲染导航树 + 响应式折叠控制                    |
| `TheHeader.vue`        | 页面头部组件                                                                          |

#### DemoUsage schema 类型

`schema` 决定 Usage Demo 自动生成的表单控件类型（详见 `OperatorView.ts`）：

```ts
type SchemeT =
  | { type: 'boolean'; default?: boolean; label?: string; disabled?: boolean }
  | { type: 'radio'; list: Array<string | number>; default?: string | number; disabled?: boolean }
  | { type: 'list'; list: Array<string | number>; default?: string | number; label?: string; disabled?: boolean }
  | { type: 'string'; default?: string; label?: string; disabled?: boolean }
  | { type: 'textarea'; default?: string; row?: number; disabled?: boolean }
  | { type: 'number'; default?: number; min?: number; max?: number; step?: number; label?: string; disabled?: boolean };
```

#### NavItem 类型

`NavItem` 定义在 `src/stores/sidebar.ts`，用于侧边栏导航树和 `RecursiveMenu`：

```ts
type NavItem = {
  value: string;
  label: string; // 支持 ^[]() 注解语法
  children?: NavItem[];
};
```

## 文档站运行时（`src/`）

### stores/

| Store        | 职责                                                                                                                             |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| `theme.ts`   | 管理皮肤（e/k/a/g/m/u）和明暗色，动态加载 Token CSS，同步 URL query                                                              |
| `sidebar.ts` | 管理侧边栏导航树（`NavItem[]`），从路由元数据构建，支持多语言过滤、排序（第一层按 `subMenuOrder`，其余按标题）、深度就近节点查找 |

### utils/

| 文件           | 主要导出                                                                                                                    |
| -------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `code.ts`      | `compileComponent()`（动态编译 Vue SFC）、`highlight()`（Shiki 高亮）                                                       |
| `inlineTag.ts` | `renderInlineTagContent()`（文本 → VNode，运行时渲染 `^[]()` 注解标签）                                                     |
| `useScreen.ts` | 屏幕断点工具                                                                                                                |
| `getHeads.ts`  | `getHeads()` 从 Markdown DOM 提取标题结构（目录锚点）、`extractTitleWithTags()` 从 `data-annotation-*` 属性还原注解标签语法 |
| `named.ts`     | 命名工具函数                                                                                                                |
| `optimize.ts`  | 优化工具函数                                                                                                                |

## 测试架构

两套独立配置，分别针对不同运行环境：

| 配置                   | 环境                           | 匹配文件                               |
| ---------------------- | ------------------------------ | -------------------------------------- |
| `vitest.config.ts`     | Chromium Browser（Playwright） | `**/*.test.ts`（排除 `*.ssr.test.ts`） |
| `vitest.ssr.config.ts` | Node.js                        | `**/*.ssr.test.ts`                     |

测试文件放在 `__tests__/<ComponentDir>/O<Component>/`，命名约定：

| 文件名                 | 内容                                                         |
| ---------------------- | ------------------------------------------------------------ |
| `*.index.test.ts`      | 功能行为（P1/P2/P3 分级）                                    |
| `*.responsive.test.ts` | 响应式断点                                                   |
| `*.visual.test.ts`     | Pixso 设计稿 vs 渲染截图像素对比                             |
| `*.ssr.test.ts`        | `renderToString` 不抛出 + 输出包含初始值（Node.js 环境）     |
| `*.hydration.test.ts`  | 服务端 HTML → 客户端 `mount` 无水合 mismatch（Browser Mode） |

## 测试初始化（`__tests__/setup.ts`）

Browser Mode 每次运行前自动执行：

- 导入 `../../opendesign/dist/index.css`（预构建基础样式）
- 导入 `@opensig/opendesign-token/themes/e.light.token.css`（openEuler 主题 Token）
- 设置 `document.documentElement.setAttribute('data-o-theme', 'e.light')`

> `dist/index.css` 只包含上次 `build:style` 时已构建的组件。新增组件后若要在截图测试中看到正确样式，需先执行 `pnpm -C packages/opendesign build:style`。

## 测试中引用 opendesign 组件

`vitest.config.ts` 中 `@opensig/opendesign` 的 alias **优先指向构建产物**（`../opendesign/es`），而非源码目录。这样测试验证的是真实发布版本而不是未经编译的 TS 源码。

```ts
// vitest.config.ts
resolve: {
  alias: {
    '@opensig/opendesign': path.resolve(__dirname, '../opendesign/es'),
  },
},
```

**注意事项：**

- 运行测试前确保已执行 `pnpm -C packages/opendesign build:component`（生成 `es/` 目录）。
- 若某个组件尚未构建进 `es/`（如刚新增的组件），可临时将 alias 改回 `../opendesign/src`，但提交前须恢复。
- `es/` 目录下每个组件均有完整的 `.d.ts` 类型声明文件（由 `build:component` 同步生成），TypeScript 类型检查不需要额外配置。
- `es/` 目录中目前缺少 `date-picker/` 构建产物（组件在 `src/` 中存在但尚未完成构建），测试文件暂时仍使用源码 alias。构建完成后需将 alias 切回 `../opendesign/es`。

## Browser Mode 注意事项

- `vitest-browser-vue` 的 `render()` 返回 Playwright `LocatorSelectors`，不是 Testing Library。
- 每个测试后组件自动卸载，**禁止**在 `afterEach` 中调用 `document.body.innerHTML = ''`（会在 Vue unmount 前破坏 DOM）。
- 视口调整：从 `vitest/browser` 导入 `page`，调用 `page.viewport(width, height)`（不是 `@vitest/browser/context`）。
- 点击外部关闭：组件用 `e.composedPath()` 检测，需向组件 DOM **外部**新建的 `div` 派发事件，不能点 `document.body`。
- `OPopup` 面板关闭后可能仍留在 DOM：通过检查 `.o-popup-wrap` 的 `display: none` 判断，而非元素是否存在。

## 视觉还原度测试（Pixso 对比）

`*.visual.test.ts` 用于验证组件渲染结果与 Pixso 设计稿的还原度。**不需要独立 Playwright**——Vitest Browser Mode 底层即为 Playwright（`@vitest/browser-playwright` provider），`page.screenshot()` 直接可用；只有需要多浏览器（Firefox/WebKit）或完整 E2E 流程时才需要独立 Playwright。

> 该测试类型依赖 **pixso-mcp** 获取设计稿切片数据。pixso-mcp 接入后，工作流和断言方式在此补充。目前 `*.visual.test.ts` 中的用例均为 `test.todo()` 占位。

## SSR / 水合测试目标

`*.ssr.test.ts` 和 `*.hydration.test.ts` 对应 `packages/opendesign/CLAUDE.md` 中"SSR 兼容"章节的 review 要点，每个组件的 SSR 测试应覆盖：

| 测试目标                                                   | 验证方式                                                   |
| ---------------------------------------------------------- | ---------------------------------------------------------- |
| `renderToString` 不抛出错误                                | `await expect(renderToString(app)).resolves.not.toThrow()` |
| 服务端输出包含初始值                                       | `expect(html).toContain(...)`                              |
| 无水合 mismatch                                            | spy `console.error`，断言无 `Hydration` 关键字             |
| 各 prop 组合（disabled/readonly/clearable）不引入 mismatch | 同上，分 case                                              |

常见 mismatch 根因（review 和写测试时需针对性验证）：

- `Math.random()` / `Date.now()` 在 setup / 模板中直接使用
- `Teleport` / `OPopup` 未包 `<ClientOnly>`
- 条件渲染依赖 `typeof window` 等客户端状态（初始渲染应与服务端一致）
- 时区格式化：服务端和浏览器 `Intl`/`Date` 结果不一致

## 响应式测试模式

在 `beforeEach` 按断点分组调用 `page.viewport(w, h)`，参考断点与预期行为：

| 视口宽度 | 场景           | 输入框变化              |
| -------- | -------------- | ----------------------- |
| 1920px   | >1680px 默认   | 原始尺寸                |
| 1440px   | ≤1680px laptop | large→36px，medium→28px |
| 768px    | ≤840px pad_v   | large 恢复原始高度      |
| 375px    | ≤600px phone   | padding-x 收窄          |

同一 `test` 内可多次调用 `page.viewport()` 验证动态响应。

## 视觉还原度测试（Pixso MCP）

`*.visual.test.ts` 可结合 Pixso MCP 获取设计稿数据，对比组件截图与设计稿的还原度。

**前提条件：**

- 本地已安装并启动 Pixso Desktop，且目标设计文件处于激活状态
- Claude Code 已配置本地 Pixso MCP（`http://localhost:3667/mcp`，`claude mcp add --transport http pixso http://localhost:3667/mcp`）

**DSL 可表达的设计属性：**

- 布局：尺寸（width/height）、padding、gap、对齐方式
- 样式：颜色、圆角（border-radius）、边框（border width/color）、阴影（box-shadow）、模糊
- 文字：字号、行高、字重
- 设计变量（`get_variables`）：可直接对应到本项目的 CSS Token 名称

**设计稿 ID 映射规范：**

每个 `*.visual.test.ts` 文件顶部用常量对象声明与该组件相关的设计稿节点 ID，供测试逻辑直接引用：

```ts
// 设计稿映射 — 从 Pixso URL 中提取 file_key 和 item-id(guid)
const DESIGN = {
  fileKey: 'xxxxxxxxxxxxxxxx',
  nodes: {
    default: '0:100', // 默认态（medium）
    large: '0:101', // large 尺寸
    disabled: '0:102', // disabled 状态
    // ...
  },
} as const;
```

- `fileKey`：Pixso URL 中 `/design/` 后的段
- `nodes` 中的 key 与组件 prop 或状态名保持一致，方便 AI 按名索引
- 设计稿更新节点时只改此处常量，测试断言无需改动

**工作流：**

1. 通过 Pixso MCP 的 `get_node_dsl(fileKey, nodes.xxx)` 获取目标节点的 DSL（尺寸、圆角、阴影、颜色等）
2. 将 DSL 中的设计值与组件的 `getComputedStyle` 或 `getBoundingClientRect` 结果做断言
3. 可选：用 `page.screenshot()` 截图后通过 `toMatchScreenshot()` 做像素级基准对比

**截图基准存放：** `__screenshots__/` 目录，Vitest Browser Mode 内置支持（Playwright 驱动），无需额外配置。
