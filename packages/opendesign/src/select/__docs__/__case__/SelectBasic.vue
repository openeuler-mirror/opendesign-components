<docs lang="md">
  <!-- zh-CN -->

### 基础选择框

  <!-- en-US -->

### Basic selection box
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

const placeholder = 'Hint';

const selectVal1 = ref();
const selectVal2 = ref(['opt1', 'opt2', 'opt3']);
const selectVal3 = ref(['opt1', 'opt2', 'opt3']);
const selectVal4 = ref(['opt1', 'opt2', 'opt3']);
const selectVal5 = ref();
const selectVal6 = ref([]);
</script>
<template>
  <div class="demo-select-basic-wrap">
    <div class="demo-select-basic">
      <span class="demo-label">单选</span>

      <OSelect v-model="selectVal1" :placeholder="placeholder" option-title="选项标题" size="large" round="pill" clearable class="demo-select">
        <OOption v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </OSelect>

      <OSelect :placeholder="placeholder" size="large" round="pill" disabled class="demo-select">
        <OOption v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </OSelect>

      <OSelect :placeholder="placeholder" size="large" round="pill" loading class="demo-select">
        <OOption v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </OSelect>
    </div>

    <div class="demo-select-basic">
      <span class="demo-label">多选</span>
      <OSelect
        v-model="selectVal2"
        :placeholder="placeholder"
        :max-tag-count="2"
        option-title="选项标题"
        size="large"
        round="pill"
        clearable
        multiple
        class="demo-select"
      >
        <OOption v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </OSelect>

      <OSelect v-model="selectVal3" :placeholder="placeholder" :max-tag-count="2" size="large" round="pill" multiple disabled class="demo-select">
        <OOption v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </OSelect>

      <OSelect v-model="selectVal4" :placeholder="placeholder" :max-tag-count="2" size="large" round="pill" multiple loading class="demo-select">
        <OOption v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </OSelect>
    </div>

    <div class="demo-select-basic">
      <span class="demo-label">文字选择器</span>
      <OSelect
        v-model="selectVal5"
        option-title="选项标题"
        placeholder="单选文字选择器"
        variant="text"
        size="large"
        round="pill"
        color="normal"
        clearable
        class="demo-text-select"
      >
        <OOption v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </OSelect>

      <OSelect
        v-model="selectVal6"
        :max-tag-count="1"
        option-title="选项标题"
        placeholder="多选文字选择器"
        variant="text"
        size="large"
        round="pill"
        clearable
        multiple
        class="demo-text-select"
      >
        <OOption v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </OSelect>

      <OSelect placeholder="禁用文字选择器" variant="text" size="large" round="pill" disabled class="demo-text-select">
        <OOption v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </OSelect>

      <OSelect placeholder="加载文字选择器" variant="text" size="large" round="pill" loading class="demo-text-select">
        <OOption v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </OSelect>
    </div>
  </div>
</template>
<style lang="scss">
@use '../../../_styles/mixin.scss';
.demo-select-basic-wrap {
  .demo-select-basic {
    display: flex;
    flex-direction: column;
    margin-bottom: 16px;
    & > :not(:last-child) {
      margin-bottom: 16px;
    }
  }
  .demo-label {
    flex-shrink: 0;
    width: 80px;
    font-size: 16px;
  }
  .demo-select {
    max-width: 320px;
  }
  .demo-text-select {
    width: 200px;
  }
}
</style>
