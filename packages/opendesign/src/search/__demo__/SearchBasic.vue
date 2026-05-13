<script setup lang="ts">
import { ref } from 'vue';
import { OSearch } from '../index';

const inputVal = ref('');
</script>

<template>
  <h4>基础用法</h4>
  <section>
    <OSearch v-model="inputVal" placeholder="搜索" class="demo-search-input" />
    <div class="show-search-val">输入值: {{ inputVal }}</div>
  </section>
</template>

<style lang="scss" scoped>
.show-search-val {
  margin-top: 8px;
  font-size: 16px;
  line-height: 24px;
}
</style>
