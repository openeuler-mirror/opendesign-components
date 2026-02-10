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
    <div class="demo-wrap-top">
      <OInput class="demo-input" v-model="inputVal" size="large" placeholder="请输入手机号" />

      <OSelect v-model="selectedVal" size="large" class="demo-select" @click.stop>
        <OOption v-for="(item, idx) in options" :label="item.label" :value="item.value" :key="idx"></OOption>
      </OSelect>
    </div>

    <div class="demo-wrap-bottom">
      <OSelect v-model="selectedVal1" size="large" class="demo-select" @click.stop>
        <OOption v-for="(item, idx) in options1" :label="item.label" :value="item.value" :key="idx"></OOption>
      </OSelect>

      <OInput class="demo-input" v-model="inputVal" size="large" placeholder="请输入手机号" />
    </div>
  </div>
</template>
<style scoped lang="scss">
.demo-input-filter-wrap {
  .demo-select {
    --select-icon-gap: 4px;
    --select-padding: 0 7px;
  }

  .demo-wrap-top {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
    .demo-input {
      position: relative;
      z-index: 1;
      width: 200px;

      :deep(.o_box-main) {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
      }
    }

    .demo-select {
      position: relative;
      z-index: 0;
      width: 120px;
      margin-left: -1px;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;

      &:hover {
        z-index: 2;
      }
    }
  }

  .demo-wrap-bottom {
    display: flex;
    align-items: center;
    .demo-input {
      position: relative;
      z-index: 1;
      width: 220px;

      :deep(.o_box-main) {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
      }
    }

    .demo-select {
      z-index: 0;
      width: 100px;
      margin-right: -1px;
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;

      &:hover {
        z-index: 2;
      }
    }
  }
}
</style>
