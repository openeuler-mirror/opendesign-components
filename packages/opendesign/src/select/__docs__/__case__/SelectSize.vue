<docs lang="md">
<!-- zh-CN -->

### 尺寸

<!-- en-US -->

### Size
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

const placeholder = '请选择';

const selectVal1 = ref();
const selectVal2 = ref();
</script>
<template>
  <OForm layout="v" class="demo-select-size-wrap">
    <OFormItem label="L">
      <OSelect v-model="selectVal1" :placeholder="placeholder" option-title="选项标题" size="large" clearable style="width: 320px">
        <OOption v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </OSelect>
      <template #extra
        ><u>selectVal1: {{ JSON.stringify(selectVal1) }}</u></template
      >
    </OFormItem>
    <OFormItem label="M">
      <OSelect v-model="selectVal2" :placeholder="placeholder" option-title="选项标题" size="medium" clearable style="width: 320px">
        <OOption v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </OSelect>
      <template #extra
        ><u>selectVal2: {{ JSON.stringify(selectVal2) }}</u></template
      >
    </OFormItem>
  </OForm>
</template>
