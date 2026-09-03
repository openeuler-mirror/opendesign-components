<docs lang="md">
  <!-- zh-CN -->

### 多选选择器

  <!-- en-US -->

### Multiple selection selector
</docs>
<script setup lang="ts">
import { ref } from 'vue';
import { OForm, OFormItem, OOption, OSelect } from '@opensig/opendesign';

const options = [
  { label: 'option 1', value: 'opt1' },
  { label: 'option 2', value: 'opt2' },
  { label: 'option 3', value: 'opt3' },
  { label: 'option 4', value: 'opt4' },
  { label: 'option 5', value: 'opt5' },
  { label: 'option 6', value: 'opt6' },
  { label: 'option 7', value: 'opt7' },
  { label: 'option 8', value: 'opt8' },
  { label: 'option 9', value: 'opt9' },
  { label: 'option 10', value: 'opt10' },
];

/** 长文本选项——展示选项溢出换行与 tag 溢出 */
const longOptions = [
  { label: '这是一个非常长的选项文本用于演示溢出和换行的情况', value: 'long1' },
  { label: '短选项', value: 'short1' },
  { label: '这是另一个非常长的选项文本，比第一个更长，用于展示极端情况下的布局表现', value: 'long2' },
  { label: '中等长度的选项', value: 'medium1' },
  { label: '选项 E', value: 'opt5' },
];

const placeholder = 'Hint';
const selectVal2 = ref(['opt1', 'opt2', 'opt3']);
const selectVal3 = ref(['opt1', 'opt2', 'opt3']);
const selectVal4 = ref(['opt1', 'opt2', 'opt3']);
/** 预选长文本项，触发 tag 溢出 */
const selectVal5 = ref(['long1', 'long2']);
</script>
<template>
  <OForm layout="v" class="demo-select-basic-wrap">
    <OFormItem label="默认">
      <OSelect v-model="selectVal2" :placeholder="placeholder" :max-tag-count="2" option-title="选项标题" size="large" clearable multiple class="demo-select">
        <OOption v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </OSelect>
      <template #extra
        ><u>selectVal2: {{ JSON.stringify(selectVal2) }}</u></template
      >
    </OFormItem>
    <OFormItem label="禁用">
      <OSelect v-model="selectVal3" :placeholder="placeholder" :max-tag-count="2" size="large" multiple disabled class="demo-select">
        <OOption v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </OSelect>
      <template #extra
        ><u>selectVal3: {{ JSON.stringify(selectVal3) }}</u></template
      >
    </OFormItem>
    <OFormItem label="加载中">
      <OSelect v-model="selectVal4" :placeholder="placeholder" :max-tag-count="2" size="large" multiple loading class="demo-select">
        <OOption v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </OSelect>
      <template #extra
        ><u>selectVal4: {{ JSON.stringify(selectVal4) }}</u></template
      >
    </OFormItem>
    <OFormItem label="长文本">
      <OSelect v-model="selectVal5" :placeholder="placeholder" clearable multiple class="demo-select">
        <OOption v-for="item in longOptions" :key="item.value" :label="item.label" :value="item.value" />
      </OSelect>
      <template #extra
        ><u>selectVal5: {{ JSON.stringify(selectVal5) }}</u></template
      >
    </OFormItem>
  </OForm>
</template>
<style lang="scss">
.demo-select-basic-wrap {
  .demo-select {
    max-width: 320px;
  }
}
</style>
