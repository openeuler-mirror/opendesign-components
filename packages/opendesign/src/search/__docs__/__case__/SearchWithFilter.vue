<docs lang="md">
  <!-- zh-CN -->

### 筛选搜索框

  <!-- en-US -->

### Filter search box
</docs>
<script setup lang="ts">
import { ref } from 'vue';

const inputVal = ref('');

const prefixSelectedVal = ref('+86(中国)');

const prefixOptions = [
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

const updatePrefixSelectedVal = (val: string) => {
  prefixSelectedVal.value = val;
};
</script>
<template>
  <OSearch
    v-model="inputVal"
    placeholder="搜索"
    show-prefix-select
    :options-of-prefix-select="prefixOptions"
    :prefix-selected-val="prefixSelectedVal"
    class="demo-usage-search"
    @prefix-selected="updatePrefixSelectedVal"
  />
</template>
