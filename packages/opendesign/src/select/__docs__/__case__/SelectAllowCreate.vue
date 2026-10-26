<docs lang="md">
  <!-- zh-CN -->

### 创建新选项 ^[1.2.7](primary)

通过 `allowCreate` 开启创建新选项能力。当输入的值不存在于选项列表时，下拉首项显示「创建 xxx」。创建的选项会持久化到选项列表中，失焦后重新展开面板仍可见。

- `createLabel`：自定义创建项的显示文案
- `autoTagInMultiple`：多选模式下自动开启创建行为（默认 `false`，需显式开启）
- `create` 事件：创建新选项时触发，参数为创建的值
- `renderLabel` / `#option-label`：自定义选项 label 渲染，创建项同样适用

多选模式下创建的选项会以 tag 形式展示，可逐个删除。

> ℹ️ **移动端限制**：响应式模式（屏幕宽度 ≤ 840px）下不支持创建选项，`allowCreate` 及 `autoTagInMultiple` 不生效。如需在移动端启用创建，设置 `noResponsive` 以禁用响应式模式。

  <!-- en-US -->

### Allow Create New Option ^[1.2.7](primary)

Enable creating new options via `allowCreate`. When the input value doesn't exist in the options list, the first dropdown item shows "Create xxx". Created options persist in the options list, remaining visible after blur and refocus.

- `createLabel`: customize the display text of the create option
- `autoTagInMultiple`: auto-enable creation behavior in multiple mode (default `false`, must be explicitly enabled)
- `create` event: triggered when creating a new option, parameter is the created value
- `renderLabel` / `#option-label`: custom option label rendering, also applies to created options

Created options in multiple mode are displayed as tags and can be removed individually.

> ℹ️ **Mobile Limitation**: In responsive mode (screen width ≤ 840px), creating options is not supported — `allowCreate` and `autoTagInMultiple` have no effect. To enable creation on mobile, set `noResponsive` to disable responsive mode.
</docs>
<script setup lang="ts">
import { ref, h } from 'vue';
import { OForm, OFormItem, OOption, OSelect } from '@opensig/opendesign';
import type { SelectOptionData } from '@opensig/opendesign';

const options = [
  { label: 'JavaScript', value: 'js' },
  { label: 'TypeScript', value: 'ts' },
  { label: 'Python', value: 'py' },
  { label: 'Java', value: 'java' },
  { label: 'Go', value: 'go' },
];

/** renderLabel：自定义选项 label 渲染，已选项前显示 ✓ */
const renderCustomLabel = (option: SelectOptionData, selected: boolean) => {
  return h('span', { style: `font-weight: ${selected ? 600 : 400}` }, `${selected ? '✓ ' : ''}${option.label}`);
};

/** 自定义创建项文案 */
const customCreateLabel = (input: string) => `➕ 添加语言: ${input}`;

/** 创建事件日志 */
const createLog = ref<string[]>([]);

const onCreate = (value: string) => {
  createLog.value.unshift(value);
};

const selectVal1 = ref();
const selectVal2 = ref<string[]>([]);
const selectVal3 = ref<string[]>([]);
const selectVal4 = ref<string[]>([]);
</script>
<template>
  <OForm layout="v" class="demo-select-create-wrap">
    <OFormItem label="单选创建">
      <OSelect v-model="selectVal1" :options="options" filterable allow-create placeholder="输入编程语言" clearable class="demo-select" @create="onCreate" />
      <template #extra
        ><u>selectVal1: {{ JSON.stringify(selectVal1) }}</u></template
      >
    </OFormItem>
    <OFormItem label="多选创建">
      <OSelect
        v-model="selectVal3"
        :options="options"
        multiple
        filterable
        allow-create
        :max-tag-count="3"
        placeholder="输入并创建"
        clearable
        class="demo-select"
        @create="onCreate"
      />
      <template #extra
        ><u>selectVal3: {{ JSON.stringify(selectVal3) }}</u></template
      >
    </OFormItem>
    <OFormItem label="自定义文案">
      <OSelect
        v-model="selectVal2"
        :options="options"
        multiple
        filterable
        allow-create
        :create-label="customCreateLabel"
        :max-tag-count="3"
        placeholder="输入并创建"
        clearable
        class="demo-select"
        @create="onCreate"
      />
      <template #extra
        ><u>selectVal2: {{ JSON.stringify(selectVal2) }}</u></template
      >
    </OFormItem>
    <OFormItem label="自定义渲染">
      <OSelect
        v-model="selectVal4"
        :options="options"
        multiple
        filterable
        allow-create
        :create-label="customCreateLabel"
        :render-label="renderCustomLabel"
        :max-tag-count="3"
        placeholder="输入并创建"
        clearable
        class="demo-select"
        @create="onCreate"
      />
      <template #extra
        ><u>selectVal4: {{ JSON.stringify(selectVal4) }}</u></template
      >
    </OFormItem>
    <OFormItem v-if="createLog.length" label="创建记录">
      <span>{{ createLog.join(' / ') }}</span>
    </OFormItem>
  </OForm>
</template>
<style lang="scss">
.demo-select-create-wrap {
  .demo-select {
    max-width: 320px;
  }
}
</style>
