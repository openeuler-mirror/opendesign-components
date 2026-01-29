<docs lang="md">
  <!-- zh-CN -->

#### 筛选输入框

  <!-- en-US -->

#### Filter input box.
</docs>
<script setup lang="ts">
import { ref } from 'vue';
import { OInput, OSelect, OOption } from '@opensig/opendesign';

const inputVal = ref('18888888888');
const selectedVal = ref('+86(中国)');
const selectedVal1 = ref('.com');
const options = [
  {
    label: '+86(中国)',
    value: '+86(中国)',
  },
  {
    label: '+81(日本)',
    value: '+81(日本)',
  },
  {
    label: '+82(韩国)',
    value: '+82(韩国)',
  },
];

const options1 = [
  {
    label: '.com',
    value: '.com',
  },
  {
    label: '.cn',
    value: '.cn',
  },
  {
    label: '.net',
    value: '.net',
  },
];
</script>
<template>
  <div class="demo-input-filter-wrap">
    <OInput class="demo-input-right" v-model="inputVal" size="large" placeholder="请输入手机号">
      <template #prefix>
        <OSelect v-model="selectedVal" size="large" class="demo-select" @click.stop>
          <OOption v-for="(item, idx) in options" :label="item.label" :value="item.value" :key="idx"></OOption>
        </OSelect>
      </template>
    </OInput>

    <OInput class="demo-input-left" v-model="inputVal" size="large" placeholder="请输入手机号">
      <template #suffix>
        <OSelect v-model="selectedVal1" size="large" class="demo-select" @click.stop>
          <OOption v-for="(item, idx) in options1" :label="item.label" :value="item.value" :key="idx"></OOption>
        </OSelect>
      </template>
    </OInput>
  </div>
</template>
<style scoped lang="scss">
.demo-input-filter-wrap {
  display: flex;
  flex-direction: column;
}
.demo-input-right {
  width: 320px;
  margin-bottom: 12px;
  &.o-input {
    --_box-padding: 0 15px 0 0;
  }

  :deep(.o_input-prefix) {
    border-right: var(--_box-bd);
    margin-right: 16px;
  }
}

.demo-select {
  --select-icon-gap: 4px;
  --select-padding: 0 7px;
  border: none;
}

.demo-input-left {
  width: 320px;
  &.o-input {
    --_box-padding: 0 0 0 15px;
  }

  :deep(.o_input-suffix) {
    border-left: var(--_box-bd);
    margin-left: 16px;
  }

  .demo-select {
    width: 100px;
  }
}
</style>
