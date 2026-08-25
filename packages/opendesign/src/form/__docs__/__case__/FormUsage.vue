<docs lang="md">
<!-- zh-CN -->

### 使用

目前 `OForm` 支持的表单项有 `OInput`、`OInputNumber`、`OTextarea`、`OSelect`、`OCheckboxGroup`、`ORadioGroup`、`OUpload`、`ODatePicker`、`OTimePicker`、`OIpInput`、`OCascaderV2`、`OSwitch`

**布局**

| 属性           | 说明                                      |
| -------------- | ----------------------------------------- |
| `layout`       | `h` 水平 / `v` 垂直 / `inline` 行内       |
| `labelAlign`   | 标签垂直对齐：`top` / `center` / `bottom` |
| `labelJustify` | 标签水平对齐：`left` / `center` / `right` |
| `labelWidth`   | 标签宽度，支持 `'auto'` 自动计算最宽标签  |

**全局继承属性**

`size`、`disabled`、`round`、`clearable` 可经 `OForm` 统一设置，由 `OFormItem` 与控件同名 prop 逐级覆盖。完整优先级与继承规则见 [继承关系](#继承关系-next)。

<!-- en-US -->

### Usage

Currently, `OForm` supports the following form items: `OInput`, `OInputNumber`, `OTextarea`, `OSelect`, `OCheckboxGroup`, `ORadioGroup`, `OUpload`, `ODatePicker`, `OTimePicker`, `OIpInput`, `OCascaderV2`, `OSwitch`

**Layout**

| Prop           | Description                                                          |
| -------------- | -------------------------------------------------------------------- |
| `layout`       | `h` horizontal / `v` vertical / `inline` inline                      |
| `labelAlign`   | Label vertical alignment: `top` / `center` / `bottom`                |
| `labelJustify` | Label horizontal alignment: `left` / `center` / `right`              |
| `labelWidth`   | Label width, supports `'auto'` for auto-calculating the widest label |

**Global Inherited Props**

`size`, `disabled`, `round`, `clearable` can be set via `OForm`, overridden by `OFormItem` / control props of the same name. See [Inheritance](#inheritance-next) for the full priority and inheritance rules.
</docs>
<script setup lang="ts">
import { reactive } from 'vue';
import { propsToAttrStr } from '../../../_demo/utils';
import { DocDemoSchema, DocDemoTemplate } from '../../../_demo/types';

const _oSchema = {
  layout: {
    type: 'list',
    list: ['h', 'v', 'inline'],
    default: 'h',
  },
  labelAlign: {
    type: 'list',
    list: ['top', 'center', 'bottom'],
    default: 'top',
  },
  labelJustify: {
    type: 'list',
    list: ['left', 'center', 'right'],
    default: 'left',
  },
  labelWidth: {
    type: 'string',
    default: '80px',
  },
  size: {
    type: 'list',
    list: ['large', 'medium', 'small'],
    default: 'large',
  },
  disabled: {
    type: 'boolean',
    default: false,
  },
  round: {
    type: 'string',
    default: '',
  },
  clearable: {
    type: 'boolean',
    default: false,
  },
} satisfies Record<string, DocDemoSchema>;

const _oTemplate: DocDemoTemplate<typeof _oSchema> = (props) => {
  return `
<div style="padding: var(--o-r-gap-4)">
  <OForm :model="ctx.model" has-required ${propsToAttrStr(props)}>
    <OFormItem label="Input" field="name" required>
      <OInput v-model="ctx.model.name" placeholder="请输入" />
    </OFormItem>
    <OFormItem label="Textarea" field="remark" required>
      <OTextarea v-model="ctx.model.remark" placeholder="请输入备注" />
    </OFormItem>
    <OFormItem label="Select" field="city" required>
      <OSelect v-model="ctx.model.city" placeholder="请选择">
        <OOption v-for="item in ctx.options" :key="item.value" :label="item.label" :value="item.value" />
      </OSelect>
    </OFormItem>
    <OFormItem label="Number" field="count">
      <OInputNumber v-model="ctx.model.count" />
    </OFormItem>
    <OFormItem label="Checkbox" field="hobbies">
      <OCheckboxGroup v-model="ctx.model.hobbies">
        <OCheckbox v-for="item in ctx.checkboxOptions" :key="item.value" :value="item.value">{{ item.label }}</OCheckbox>
      </OCheckboxGroup>
    </OFormItem>
    <OFormItem label="Radio" field="gender">
      <ORadioGroup v-model="ctx.model.gender">
        <ORadio v-for="item in ctx.radioOptions" :key="item.value" :value="item.value">{{ item.label }}</ORadio>
      </ORadioGroup>
    </OFormItem>
    <OFormItem label="Upload" field="files">
      <OUpload v-model="ctx.model.files" />
    </OFormItem>
    <OFormItem label="DatePicker" field="date">
      <ODatePicker v-model="ctx.model.date" />
    </OFormItem>
    <OFormItem label="TimePicker" field="time">
      <OTimePicker v-model="ctx.model.time" />
    </OFormItem>
    <OFormItem label="Cascader" field="region">
      <OCascaderV2 v-model="ctx.model.region" :options="ctx.cascaderOptions" placeholder="请选择" />
    </OFormItem>
    <OFormItem label="Switch" field="active">
      <OSwitch v-model="ctx.model.active" />
    </OFormItem>
    <OFormItem label="Remark" :disabled="false" size="small" round="4px" :clearable="false">
      <OTextarea v-model="ctx.model.overrideRemark" placeholder="FormItem 覆盖: 启用 + small + 4px + 不可清空" />
    </OFormItem>
    <OFormItem label="Ctrl override" :disabled="false">
      <OSwitch :disabled="true" v-model="ctx.model.ctrlSwitch" />
      <span style="margin-left: 8px; color: var(--o-color-info3); font-size: 12px;">控件 disabled=true 覆盖 FormItem :disabled="false"</span>
    </OFormItem>
  </OForm>
</div>`;
};

const _oCtx = {
  model: reactive({
    name: '',
    remark: '',
    city: '',
    count: 1,
    hobbies: [] as (string | number)[],
    gender: '',
    files: [],
    date: undefined as any,
    time: undefined as any,
    region: '',
    active: false,
    overrideRemark: '',
    ctrlSwitch: false,
  }),
  options: [
    { label: 'option 1', value: 'opt1' },
    { label: 'option 2', value: 'opt2' },
    { label: 'option 3', value: 'opt3' },
  ],
  checkboxOptions: [
    { label: 'A', value: 'a' },
    { label: 'B', value: 'b' },
    { label: 'C', value: 'c' },
  ],
  radioOptions: [
    { label: 'X', value: 'x' },
    { label: 'Y', value: 'y' },
  ],
  cascaderOptions: [
    {
      value: 'beijing',
      label: 'Beijing',
      children: [
        { value: 'haidian', label: 'Haidian' },
        { value: 'chaoyang', label: 'Chaoyang' },
      ],
    },
    { value: 'shanghai', label: 'Shanghai', children: [{ value: 'pudong', label: 'Pudong' }] },
  ],
};
</script>
