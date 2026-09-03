<docs lang="md">
<!-- zh-CN -->

### 使用

下拉选择器支持以下核心能力：

- **主题色**：`normal`、`success`、`warning`、`danger` 四种语义色
- **尺寸**：`small`、`medium`、`large` 三档
- **形状**：`solid`、`outline`、`text` 三种外观风格
- **圆角**：`pill` 半圆角，或任意 CSS `border-radius` 值
- **多选**：`multiple` 开启多选模式，`maxTagCount` 控制标签折叠（支持数字或 `responsive` 容器宽度自适应）
- **搜索过滤**：`filterable` 开启输入搜索，配合 `allowCreate` 可创建选项列表中不存在的值
- **状态**：`disabled` 禁用、`loading` 加载中、`clearable` 可清除
- **弹出**：`trigger` 控制触发方式，`optionPosition` 控制弹出方向，`optionWidthMode` 控制下拉宽度策略

### 表单与 GEO ^[1.2.7](primary)

OSelect 内置隐藏的原生 `<select>` + `<option>` 列表与 `data-value` 属性（视觉零影响）。传入 `name` 或 `itemprop` 时，属性绑定到原生 select 而非可见 input，无需额外配置即可支持传统表单提交、GEO 爬虫读取与结构化数据。

其他属性的说明请查看下方的 props 表。

<!-- en-US -->

### Usage

The dropdown selector supports the following core capabilities:

- **Theme colors**: four semantic colors — `normal`, `success`, `warning`, `danger`
- **Sizes**: three levels — `small`, `medium`, `large`
- **Variants**: three appearance styles — `solid`, `outline`, `text`
- **Rounded corners**: `pill` for semi-circle, or any CSS `border-radius` value
- **Multiple selection**: `multiple` enables multi-select, `maxTagCount` controls tag folding (supports number or `responsive` for container-width adaptation)
- **Search & filter**: `filterable` enables input search, combined with `allowCreate` to create values not in the option list
- **States**: `disabled`, `loading`, `clearable`
- **Popup**: `trigger` controls the trigger method, `optionPosition` controls the popup direction, `optionWidthMode` controls the dropdown width strategy

### Forms & GEO ^[1.2.7](primary)

OSelect has a built-in hidden native `<select>` + `<option>` list and `data-value` attribute (visually zero impact). When `name` or `itemprop` is passed, the attributes bind to the native select instead of the visible input, supporting traditional form submission, GEO crawling, and structured data — no extra configuration needed.

For explanations of other attributes, please refer to the props table below.
</docs>
<script setup lang="ts">
import { reactive } from 'vue';
import { propsToAttrStr } from '../../../_demo/utils';
import { DocDemoSchema, DocDemoTemplate } from '../../../_demo/types';
import { OForm, OFormItem, OOption, OSelect } from '@opensig/opendesign';

const _oSchema = reactive({
  placeholder: {
    type: 'string',
    default: '请选择',
  },
  color: {
    type: 'list',
    list: ['normal', 'success', 'warning', 'danger'],
  },
  variant: {
    type: 'list',
    list: ['outline', 'solid', 'text'],
  },
  size: {
    type: 'list',
    list: ['large', 'medium', 'small'],
  },
  round: {
    type: 'list',
    list: ['pill', '12px', 'var(--o-radius-l)'],
  },
  trigger: {
    type: 'list',
    list: ['click', 'none', 'click-outclick', 'hover', 'hover-outclick', 'focus', 'contextmenu'],
  },
  optionPosition: {
    type: 'list',
    list: ['bl', 'top', 'tl', 'tr', 'bottom', 'br', 'left', 'lt', 'lb', 'right', 'rt', 'rb'],
  },
  optionWidthMode: {
    type: 'list',
    list: ['min-width', 'auto', 'width'],
  },
  multiple: {
    type: 'boolean',
  },
  maxTagCount: {
    type: 'list',
    list: [2, 3, 'responsive'],
    default: 2,
    disabled: true as boolean,
  },
  filterable: {
    type: 'boolean',
    default: false,
  },
  allowCreate: {
    type: 'boolean',
    default: false,
    disabled: true as boolean,
  },
  disabled: {
    type: 'boolean',
  },
  clearable: {
    type: 'boolean',
    default: true,
  },
  loading: {
    type: 'boolean',
  },
}) satisfies Record<string, DocDemoSchema>;

const options = [
  { label: 'Vue', value: 'vue' },
  { label: 'React', value: 'react' },
  { label: 'Angular', value: 'angular' },
  { label: 'Svelte', value: 'svelte' },
  { label: 'Solid.js', value: 'solid' },
  { label: 'Qwik', value: 'qwik' },
  { label: 'Lit', value: 'lit' },
  { label: 'Preact', value: 'preact' },
  { label: 'Astro — 全栈 Web 框架', value: 'astro' },
  { label: 'Nuxt', value: 'nuxt', disabled: true },
];

let _prevMultiple: boolean = _oSchema.multiple.default;

const _oTemplate: DocDemoTemplate<typeof _oSchema> = (props) => {
  if (props.multiple !== _prevMultiple) {
    _prevMultiple = props.multiple;
    _oCtx.selectedVal = props.multiple ? [] : undefined;
  }
  // maxTagCount 仅在多选模式下可用
  _oSchema.maxTagCount.disabled = !props.multiple;
  // allowCreate 依赖 filterable 搜索输入
  _oSchema.allowCreate.disabled = !props.filterable;
  return `  <OForm layout="v" class="demo-select-usage-wrap">
  <OFormItem>
    <OSelect v-model=ctx.selectedVal class="demo-select-usage" option-title="技术栈" ${propsToAttrStr(props)}>
     <OOption v-for="item in ctx.options" :key="item.value" :label="item.label" :value="item.value" :disabled="item.disabled" />
    </OSelect>
    <template #extra><u>selectedVal: {{ JSON.stringify(ctx.selectedVal) }}</u></template>
  </OFormItem>
  </OForm>
  `;
};

const _oCtx = reactive({
  selectedVal: undefined as any,
  options,
});
</script>
<style lang="scss">
.demo-select-usage-wrap {
  .demo-select-usage {
    width: 100%;
    max-width: 320px;
  }
}
</style>
