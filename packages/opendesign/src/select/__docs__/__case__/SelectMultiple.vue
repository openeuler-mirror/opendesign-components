<docs lang="md">
  <!-- zh-CN -->

### 多选选择器

  <!-- en-US -->

### Multiple selection selector
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
const selectVal2 = ref(['opt1', 'opt2', 'opt3']);
const selectVal3 = ref(['opt1', 'opt2', 'opt3']);
const selectVal4 = ref(['opt1', 'opt2', 'opt3']);
</script>
<template>
  <div class="demo-select-basic-wrap">
    <div class="demo-select-basic">
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
  </div>
</template>
