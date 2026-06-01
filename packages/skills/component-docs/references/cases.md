# 组件 Demo/Case 编写规范

> **关联参考：** case 编写是文档体系的一环。注释标注（JSDoc tag、运行时警告）见 [`annotations.md`](annotations.md)；文档页面编写（index.md 行内标签、警告块、CSS 变量表）见 [`doc-pages.md`](doc-pages.md)。

> **上下文：** 本项目文档站使用 Vite 插件从 `__case__/` 目录提取 .vue Demo 文件，渲染为交互式 playground（Usage 类型）或预览+代码切换展示（Case 类型）。每个 case 文件都包含 `<docs lang="md">` 自定义块用于中英文说明。

---

## 新功能开发时的 case 决策

开发一个新 prop / 功能时，先决定需要哪些类型的 case：

| case 类型                 | 什么时候写                                                   | 渲染效果                                 |
| ------------------------- | ------------------------------------------------------------ | ---------------------------------------- |
| **Usage 交互 playground** | 组件的核心交互场景，用户需要实时调整参数看效果               | `DemoUsage`：左侧控件面板 + 右侧实时预览 |
| **Basic 基本用法**        | 组件最简单的使用方式                                         | `DemoContainer`：预览 + 代码切换         |
| **Feature-specific**      | 某个 prop/功能的专属展示，或业务中交叉使用的多个功能联动展示 | `DemoContainer`：预览 + 代码切换         |

决策原则：

- **每个组件必须有一个 Usage**——这是用户最先看到的交互 playground
- **每个核心功能至少有一个 Feature-specific case**——如果功能效果仅靠 Usage 无法充分展示（如虚拟滚动、级联选择器的异步加载），就要单独写 case
- **按业务场景组织 case，而非按 prop 机械拆分**——在业务中通常交叉使用的功能（如 DataTable 的 filter + sort）应写在同一个 case 里展示联动效果；独立使用、互不影响的功能则分开写各自的 case
- **实验性功能必须单独写 case**——不能混进普通 case 里（见下方专属章节）

---

## Usage 交互 playground 写法

Usage 是最特殊的 case 类型——它**没有 `<template>` 块**，靠 `_oSchema` + `_oTemplate` + `_oCtx` 驱动渲染。Vite 插件会自动生成 `<DemoUsage>` 包装组件。

### 文件结构

```vue
<docs lang="md">
<!-- zh-CN -->

### 按钮用法

通过调整参数查看按钮在不同配置下的效果。

<!-- en-US -->

### Button Usage

Adjust parameters to see the button in different configurations.
</docs>

<script setup lang="ts">
import { reactive } from 'vue';
import { propsToAttrStr } from '../../../_demo/utils';
import { DocDemoSchema, DocDemoTemplate } from '../../../_demo/types';
import { OButton } from '@opensig/opendesign';

// 定义可调节的参数及控件类型
const _oSchema = {
  size: {
    type: 'list',
    list: ['large', 'medium', 'small'],
  },
  disabled: {
    type: 'boolean',
    default: false,
  },
  color: {
    type: 'radio',
    list: ['primary', 'success', 'warning', 'danger'],
  },
} satisfies Record<string, DocDemoSchema>;

// 定义模板：将 schema 状态转为组件属性字符串
const _oTemplate: DocDemoTemplate<typeof _oSchema> = (props) => {
  return `<OButton ${propsToAttrStr(props)}>Button</OButton>`;
};

// 可选：定义上下文（供模板中的 v-model 等使用）
const _oCtx = reactive({
  inputVal: '',
});
</script>
```

**关键规则：**

- Usage 文件**不能有 `<template>` 块**——Vite 插件会自动生成
- `_oSchema` 必须加 `satisfies Record<string, DocDemoSchema>` 类型约束
- `_oTemplate` 使用 `propsToAttrStr(props)` 将 schema 状态转为属性字符串
- `_oCtx` 是可选的，仅在模板需要双向绑定（v-model）时使用 `reactive` 定义

### 高级 Usage 写法

当组件的交互逻辑较复杂（columns 配置、条件联动、动态数据）时，`_oTemplate` 需要更多控制。参考 DataTableUsage 的写法：

```vue
<script setup lang="tsx">
import { defineComponent, h, reactive } from 'vue';
import { DataTableColumnT, DataTableSpanMethod, TableBorderTypes, DataTableHeaderStyles, OLink, OIconCalendar } from '@opensig/opendesign';
import { propsToAttrStr } from '../../../_demo/utils';
import { DocDemoSchema, DocDemoTemplate } from '../../../_demo/types';
import { getTableData } from '../../../table/__docs__/__case__/data.ts';

const _oSchema = {
  size: { type: 'list', list: ['medium', 'small'] },
  height: { type: 'number', default: 400 },
  columnResizable: { type: 'boolean', default: false },
  stripe: { type: 'boolean', default: false },
  border: { type: 'list', list: TableBorderTypes },
  spanMethod: { type: 'boolean', default: false },
  loading: { type: 'boolean', default: false },
  selection: { type: 'boolean', default: false },
} satisfies Record<string, DocDemoSchema>;

// 使用包导出的类型标注 _oCtx，获得类型提示和约束
const _oCtx = reactive<{ columns: DataTableColumnT[]; data: any[]; spanMethod: DataTableSpanMethod; selectedKeys: string[] }>({
  columns: [],
  data: [],
  spanMethod: ({ colIndex, rowIndex }) => {
    if (colIndex === 1 && rowIndex === 2) {
      return { colSpan: 2, rowSpan: 2 };
    }
  },
  selectedKeys: [],
});

const _oTemplate: DocDemoTemplate<typeof _oSchema> = (_props) => {
  // 在返回模板字符串之前，根据 schema props 更新 _oCtx
  _oCtx.columns = getColumns(_props);
  _oCtx.data = _props.loading ? [] : getTableData(15);

  return `
<ODataTable
  ${propsToAttrStr({ ..._props, spanMethod: undefined })}
  :columns="ctx.columns"
  :data="ctx.data"
  ${_props.spanMethod ? ':span-method="ctx.spanMethod"' : ''}
  ${_props.selection ? 'v-model:selected-keys="ctx.selectedKeys"' : ''}
/>`;
};
</script>
```

**高级写法的要点：**

1. **`lang="tsx"`**：当 `_oTemplate` 或 columns 中需要用 `h()` / TSX 渲染 VNode 时，script 标签改为 `<script setup lang="tsx">`
2. **`_oCtx` 用导出类型标注**：`reactive<{ columns: DataTableColumnT[]; ... }>({ ... })`，获得完整类型提示
3. **`_oTemplate` 中更新 `_oCtx`**：根据 schema props 动态构造 columns / data，再在模板字符串中通过 `ctx.xxx` 引用
4. **条件属性**：用 `${condition ? ':prop="ctx.xxx"' : ''}` 按需绑定，避免无效属性
5. **schema.list 可用导出常量**：如 `list: TableBorderTypes`，让控件选项与组件实际支持的值保持同步
6. **`propsToAttrStr` 中排除特殊 prop**：如 `{ ..._props, spanMethod: undefined }` 排除后单独用条件绑定处理

### Schema 控件类型

| type         | 渲染为     | 必填字段 | 可选字段                        |
| ------------ | ---------- | -------- | ------------------------------- |
| `'boolean'`  | 开关       | —        | `default`, `label`, `disabled`  |
| `'list'`     | 下拉选择   | `list`   | `default`, `label`              |
| `'radio'`    | 单选按钮组 | `list`   | `default`                       |
| `'string'`   | 文本输入   | —        | `default`, `label`              |
| `'number'`   | 数字输入   | —        | `default`, `min`, `max`, `step` |
| `'textarea'` | 多行文本   | —        | `default`, `row`, `label`       |

schema 的 key 名应与组件的 prop 名一致，这样 `propsToAttrStr` 能正确映射。

---

## 普通 Case 写法

普通 case 是标准 Vue SFC，由 `DemoContainer` 渲染为预览 + 代码切换。

### 文件结构

各段顺序：`<docs>` → `<script setup>` → `<template>` → `<style scoped>`（如有）。

```vue
<docs lang="md">
<!-- zh-CN -->

### 加载状态

通过 `loading` 属性显示按钮的加载状态。

<!-- en-US -->

### Loading State

Show the button's loading state via the `loading` prop.
</docs>

<script setup lang="ts">
import { ref } from 'vue';
import { OButton } from '@opensig/opendesign';

const loading = ref(false);
const handleClick = () => {
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
  }, 2000);
};
</script>

<template>
  <div class="row">
    <OButton :loading="loading" @click="handleClick">Click Me</OButton>
  </div>
</template>

<style lang="scss" scoped>
.row {
  display: flex;
  gap: 12px;
}
</style>
```

### 好的 case vs 纯展示 case

好的 case 展示**多种状态/变体**，有交互行为，帮助读者理解功能的完整用法：

```vue
<template>
  <div class="row">
    <OButton>默认</OButton>
    <OButton loading>加载中</OButton>
    <OButton :loading="loading" @click="handleClick">点击触发</OButton>
  </div>
</template>
```

纯展示 case 只有一个静态实例，信息密度低——仅在功能本身极其简单时才可接受。

---

## 输入类组件的 case 写法

输入类组件（接入表单系统的控件：OInput、OSelect、ODatePicker、OTimePicker、OSearch、OInputNumber、OUpload、OCascaderV2 等）的 case 有特殊要求：**用 OForm 包裹，在 OFormItem 的 `#extra` 插槽展示真实的 modelValue**。

这样做的原因：

- 输入类组件的 case 需要让读者直观看到值的变化，而不是只看到控件外观
- OFormItem 的 `#extra` 插槽会在控件下方额外展示一行内容，天然适合展示 modelValue
- OForm 提供了响应式布局（水平/垂直切换），在移动端也能正常展示

### 普通 case 写法

```vue
<docs lang="md">
<!-- zh-CN -->

### 选择器类型

根据业务需要选择对应的选择器组件。

<!-- en-US -->

### Picker Types

Choose the appropriate picker component based on your needs.
</docs>

<script setup lang="ts">
import { ref } from 'vue';
import dayjs from 'dayjs';
import { ODatePicker, OForm, OFormItem } from '@opensig/opendesign';
import { useScreen } from '@/utils/useScreen';

const { lePadV } = useScreen();

const val = ref<number>();
</script>

<template>
  <OForm :layout="lePadV ? 'v' : 'h'" label-width="140px">
    <OFormItem label="ODatePicker">
      <ODatePicker v-model="val" clearable />
      <template #extra>
        {{ val }} <u v-if="val">{{ dayjs(val).format('YYYY-MM-DD HH:mm:ss') }}</u>
      </template>
    </OFormItem>
  </OForm>
</template>
```

**关键要素：**

1. **导入 `OForm`、`OFormItem`**：从 `@opensig/opendesign` 导入
2. **导入 `useScreen`**：从 `@/utils/useScreen` 导入，用于响应式布局切换
3. **OForm 属性**：`layout` 用 `lePadV ? 'v' : 'h'` 实现移动端垂直/桌面端水平切换；`label-width` 根据文案长度调整
4. **`#extra` 插槽**：展示 modelValue 的原始值和可读格式
5. **`<u>` 标签**：可选，用于展示人类可读的格式化值（如时间戳→日期字符串），与原始值形成对照

### `#extra` 插槽的展示策略

| 值类型              | 展示写法              | 示例                                                                |
| ------------------- | --------------------- | ------------------------------------------------------------------- |
| **时间戳 / 日期**   | 原始值 + dayjs 格式化 | `{{ val }} <u v-if="val">{{ dayjs(val).format('YYYY-MM-DD') }}</u>` |
| **简单字符串/数字** | 直接展示              | `{{ val }}`                                                         |
| **数组（多选等）**  | 直接展示              | `{{ val }}`                                                         |
| **start/end 双值**  | 分别展示              | `start: {{ start }} end: {{ end }}`                                 |

### 多个对比项的写法

同一个 case 展示多个配置对比时，每个对比项放在独立的 `<OFormItem>` 中：

```vue
<template>
  <OForm :layout="lePadV ? 'v' : 'h'" label-width="220px">
    <OFormItem label="基础多选">
      <OCascaderV2 v-model="val1" :options="options" multiple clearable />
      <template #extra>{{ val1 }}</template>
    </OFormItem>
    <OFormItem label="maxTagCount=1">
      <OCascaderV2 v-model="val2" :options="options" multiple :max-tag-count="1" clearable />
      <template #extra>{{ val2 }}</template>
    </OFormItem>
  </OForm>
</template>
```

### Usage case 的写法（输入类组件）

Usage case 仍使用 `_oSchema` + `_oTemplate` 模式，**不使用 OForm 包裹**。modelValue 在 `_oTemplate` 返回的模板字符串中内联展示：

```vue
<script setup lang="ts">
import { reactive } from 'vue';
import { propsToAttrStr } from '../../../_demo/utils';
import { DocDemoSchema, DocDemoTemplate } from '../../../_demo/types';
import { ODatePicker } from '@opensig/opendesign';

const _oSchema = {
  size: { type: 'list', list: ['large', 'medium', 'small'] },
  disabled: { type: 'boolean' },
  clearable: { type: 'boolean', default: true },
} satisfies Record<string, DocDemoSchema>;

const _oCtx = reactive({
  val: '',
});

const _oTemplate: DocDemoTemplate<typeof _oSchema> = (props) => {
  return `<div style="display:flex;align-items:center;gap:12px;"><ODatePicker v-model="ctx.val" style="width:290px" ${propsToAttrStr(props)} /><span>{{ ctx.val }}</span></div>`;
};
</script>
```

**关键：** `_oTemplate` 中用 `<span>{{ ctx.val }}</span>` 在控件旁展示值，而非 `#extra` 插槽。

---

## `<docs lang="md">` 块格式

每个 case 文件**必须**包含 `<docs lang="md">` 块，这是 case 的文档说明，会被 Vite 插件提取并渲染到文档页。

```vue
<docs lang="md">
<!-- zh-CN -->

### 标题

中文说明...

<!-- en-US -->

### Title

English description...
</docs>
```

规则：

- 语言标记必须用 `<!-- zh-CN -->` 和 `<!-- en-US -->`（精确格式，不能写成 `<!-- Chinese -->` 等）
- 中英文标题级别必须一致（通常用 `###` 或 `####`）
- 标题尽量简洁，与功能名对应
- 说明文字应解释**what**（这是什么）和**how**（怎么用），不要只重复 prop 名

---

## 命名约定与导入

| 文件名                | 含义                              | 示例                     |
| --------------------- | --------------------------------- | ------------------------ |
| `<Name>Usage.vue`     | 交互 playground（每个组件必须有） | `BtnUsage.vue`           |
| `<Name>Basic.vue`     | 基本用法                          | `TagBasic.vue`           |
| `<Name><Feature>.vue` | 功能专属展示                      | `BtnLoading.vue`         |
| `data.ts`             | 共享数据辅助（可选）              | `table/__case__/data.ts` |

导入方式：

```typescript
// 组件、图标、类型——统一从 @opensig/opendesign 导入
import { OButton, OIconAdd, DataTableColumnT, DataTableSortMethodT } from '@opensig/opendesign';

// ❌ 禁止从相对路径或 @ 别名导入 opendesign 的导出
// import { OButton } from '@/button/index'
// import { OButton } from '../button/OButton.vue'

// 辅助数据导入——从本地 data.ts（非 opendesign 导出，可用相对路径）
import { getTableData } from './data';

// 内部开发工具——@ 别名仅用于非 opendesign 导出的项目内部模块
import { useScreen } from '@/utils/useScreen';

// Usage 专用导入——_demo 是文档站内部工具，不在 opendesign 包中
import { propsToAttrStr } from '../../../_demo/utils';
import { DocDemoSchema, DocDemoTemplate } from '../../../_demo/types';
```

**规则：** `@opensig/opendesign` 的所有导出（组件、图标、类型、常量）必须从包名导入。相对路径和 `@/` 别名仅用于项目内部模块（`_demo` 工具、`data.ts`、`useScreen` 等非 opendesign 导出的内容）。

---

## 主题可见性

某些 case 只在特定主题下展示：

```markdown
<!-- @case:a BtnAscendThemeText -->     <!-- 仅 Ascend 主题 -->
<!-- @case:k BtnKunpengThemeText -->    <!-- 仅 Kunpeng 主题 -->
<!-- @case:e BtnOpenEulerThemePrimary --> <!-- 仅 openEuler 主题 -->
<!-- @case:a|k|e BtnThemeNormal -->     <!-- 所有三个主题 -->
```

主题代码：`a`（Ascend）、`k`（Kunpeng）、`e`（openEuler）、`d`（default）

如果某个功能在不同主题下的外观/行为有差异，为每个主题写专属 case 并加上可见性标记。外观一致时用 `:a|k|e` 让所有主题可见。

---

## 实验性功能的 case 处理

实验性 prop/功能**必须单独写 case**，不能混进普通 case 里：

```vue
<!-- __case__/VirtualListVirtual.vue -->
<docs lang="md">
<!-- zh-CN -->

### 虚拟滚动 ^[experimental](warning)`API 尚未稳定`

> **实验性功能：** 此功能 API 尚未稳定，后续版本可能发生变更，不建议在生产环境中使用。

通过 `virtual` 属性开启虚拟滚动。在 SSR 环境下将自动降级为全量渲染。

<!-- en-US -->

### Virtual Scrolling ^[experimental](warning)`API not yet stable`

> **Experimental:** This feature's API is not yet stable and may change in future versions. Not recommended for production use.

Enable virtual scrolling via the `virtual` prop. Falls back to full rendering in SSR environments.
</docs>

<script setup lang="ts">
import { OVirtualList } from '@opensig/opendesign';
</script>

<template>
  <!-- demo 内容 -->
</template>
```

在 `index.zh-CN.md` 的示例区引用时，与普通 case 分开放置：

```markdown
## 示例

<!-- @usage VirtualListUsage -->
<!-- @case VirtualListBasic -->

<!-- 实验性功能单独放，让读者一眼看到分隔 -->
<!-- @case VirtualListVirtual -->
```

---

## 废弃功能的 case 处理

如果废弃的 prop/功能有对应的 case，在 `<docs>` 块中加废弃说明（不要删除 case——已有文档仍需展示）：

```vue
<docs lang="md">
<!-- zh-CN -->

### 类型选择

> [!WARNING]
> `type` 属性已废弃，请使用 [`variant`](#variant) 代替。

<!-- en-US -->

### Type Selection

> [!WARNING]
> The `type` prop is deprecated. Use [`variant`](#variant) instead.
</docs>
```

---

## SSR 安全写法

case 是用户最可能复制到项目中的代码，因此必须保证 SSR 安全，避免用户因复制而引入 SSR 错误。

**必须遵守：**

| 规则                                     | 正确写法                                          | 错误写法                                                          |
| ---------------------------------------- | ------------------------------------------------- | ----------------------------------------------------------------- |
| setup 顶层不能使用随机值                 | 数据在 `<script>` 中静态定义，或从 `data.ts` 导入 | `const id = Math.random()` / `const now = Date.now()`             |
| setup 顶层不能访问浏览器 API             | 浏览器 API 放在 `onMounted` / 事件处理器中        | `const width = window.innerWidth` / `document.querySelector(...)` |
| ref 初始值必须是静态的                   | `ref('')` / `ref(0)` / `ref([])` / `ref(false)`   | `ref(window.location.href)` / `ref(Date.now())`                   |
| 含 Teleport/OPopup 的组件需包 ClientOnly | `<ClientOnly><OSelect ... /></ClientOnly>`        | 直接渲染含弹层的组件                                              |

**常见易错场景：**

```typescript
// ❌ 会导致 SSR hydration mismatch——服务端和客户端生成不同的随机值
const items = ref(Array.from({ length: 10 }, () => ({ id: Math.random() })));

// ✅ 使用固定数据或从 data.ts 导入
import { getTableData } from './data';
const items = ref(getTableData(10));
```

```vue
<!-- ❌ OSelect 内部使用 OPopup（Teleport），SSR 中挂载点不存在 -->
<OSelect v-model="val" :options="options" />

<!-- ✅ 包裹 ClientOnly -->
<ClientOnly>
  <OSelect v-model="val" :options="options" />
</ClientOnly>
```

---

## 变量声明使用包导出的类型

在 case 中声明与组件交互相关的变量（事件回调参数、columns 配置、conditions 等）时，**优先使用 `@opensig/opendesign` 导出的类型**来约束，获得类型提示和代码补全：

```typescript
// ✅ 使用包导出的类型——获得完整提示
import { DataTableColumnT, DataTableSortMethodT } from '@opensig/opendesign';

const columns = ref<DataTableColumnT[]>([]);
const conditions = ref<{
  name: string[];
  ageSort?: DataTableSortMethodT;
}>({ name: [], ageSort: DataTableSortMethod.NA });

// ❌ 手写复杂类型——容易与组件实际类型不一致
const conditions = ref<{
  name: string[];
  ageSort?: 'asc' | 'desc' | 'na'; // 可能与组件定义不同步
}>({ name: [], ageSort: 'na' });
```

**需要的类型未导出时：**

如果遇到较复杂的类型（如事件回调的多个形参类型）在 `@opensig/opendesign` 中没有导出，应向开发者提问是否应该添加该类型的导出。若同意，则在组件的 `types.ts` 中导出该类型，再在 case 中使用。

```typescript
// types.ts 中新增导出
export type DataTableConditionUpdateEventT = { ... };

// case 中使用
import { DataTableConditionUpdateEventT } from '@opensig/opendesign';
const handleConditionUpdate = (e: DataTableConditionUpdateEventT) => { ... };
```

---

## Case 在 index.md 中的引用

case 写完后，需要在 `index.zh-CN.md` / `index.en-US.md` 的示例区引用：

| 引用方式                       | 渲染效果                    | 适用 case 类型 |
| ------------------------------ | --------------------------- | -------------- | ------------ | ------------- |
| `<!-- @usage XxxUsage -->`     | `DemoUsage` 交互 playground | 仅 Usage 类型  |
| `<!-- @case XxxBasic -->`      | `DemoContainer` 预览+代码   | 所有普通 case  |
| `<!-- @case:a                  | k                           | e Xxx -->`     | 主题限定展示 | 主题专属 case |
| `<!-- @api OComponentName -->` | API 表格（自动生成）        | 不需要写 case  |

引用顺序：Usage → Basic → Feature cases → 实验性 cases（分区放置）。

---

## 质量检查点

- [ ] `<docs lang="md">` 块有完整的 `<!-- zh-CN -->` 和 `<!-- en-US -->` 部分
- [ ] case 组织方式符合业务场景——交叉使用的功能写在同一 case，独立功能分开写
- [ ] 有交互行为时使用了 reactive ref + event handler，而非纯静态展示
- [ ] `<style>` 使用 `scoped` 防止全局污染
- [ ] SSR 安全：setup 顶层没有 `Math.random()`/`Date.now()`/`window`/`document`，含弹层组件包了 `ClientOnly`
- [ ] CSS 值使用了 opendesign-token 变量（`var(--o-color-*)` 等），而非硬编码
- [ ] 文件命名符合约定（XxxUsage / XxxBasic / XxxFeature）
- [ ] 所有 opendesign 导出（组件、图标、类型、常量）从 `@opensig/opendesign` 导入，未使用相对路径或 `@/` 别名
- [ ] 与组件交互的变量使用了包导出的类型标注（如 `DataTableColumnT`、`DataTableSortMethodT`）
- [ ] 需要但未导出的复杂类型已向开发者确认是否应添加导出
- [ ] 实验性 case 与普通 case 分开放置
- [ ] 主题专属 case 加了可见性标记（`:a/:k/:e`）
- [ ] case 在 index.md 中正确引用
