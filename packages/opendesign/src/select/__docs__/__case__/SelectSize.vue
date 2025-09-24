<docs lang="md">
<!-- zh-CN -->

### 尺寸

<!-- en-US -->

### Size
</docs>
<script setup lang="ts">
import { ref } from 'vue';

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
  <div class="demo-select-size-wrap">
    <div class="demo-select-size">
      <span class="demo-label">L</span>
      <OSelect v-model="selectVal1" :placeholder="placeholder" option-title="选项标题" size="large" round="pill" clearable style="width: 320px">
        <OOption v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </OSelect>
    </div>
    <div class="demo-select-size">
      <span class="demo-label">M</span>
      <OSelect v-model="selectVal2" :placeholder="placeholder" option-title="选项标题" size="medium" round="pill" clearable style="width: 320px">
        <OOption v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </OSelect>
    </div>
  </div>
</template>
<style lang="scss">
.demo-select-size-wrap {
  .demo-select-size {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
  }
  .demo-label {
    flex-shrink: 0;
    width: 20px;
    margin-right: 16px;
    font-size: 16px;
  }
}
</style>
