<docs lang="md">
  <!-- zh-CN -->

### 单选选择器

  <!-- en-US -->

### Single selection selector
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

const placeholder = 'Hint';

const selectVal1 = ref();
</script>
<template>
  <OForm layout="v" class="demo-select-basic-wrap">
    <OFormItem>
      <OSelect v-model="selectVal1" :placeholder="placeholder" option-title="选项标题" size="large" clearable class="demo-select">
        <OOption v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </OSelect>
      <template #extra
        ><u>selectVal1: {{ JSON.stringify(selectVal1) }}</u></template
      >
    </OFormItem>
    <OFormItem label="禁用">
      <OSelect :placeholder="placeholder" size="large" disabled class="demo-select">
        <OOption v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </OSelect>
    </OFormItem>
    <OFormItem label="加载中">
      <OSelect :placeholder="placeholder" size="large" loading class="demo-select">
        <OOption v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </OSelect>
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
