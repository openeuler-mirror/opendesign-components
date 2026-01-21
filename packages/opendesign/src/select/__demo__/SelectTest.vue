<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { OSelect } from '../index';
import { OOption } from '../../option';

const selectVal1 = ref<number | string>(0);
const options = ref<Array<{ label: string; value: number }>>([]);
console.time('select');
options.value = new Array(100).fill(1).map((_, idx) => ({
  label: `option ${idx}`,
  value: idx,
}));
console.timeEnd('select');

watchEffect(() => {
  console.log(selectVal1.value);
});
</script>
<template>
  <h4>Issue: <a href="https://gitee.com/openeuler/opendesign-components/pulls/190">#I9H2IP</a></h4>
  <p>修复无法默认选中 value 为 0 的option</p>

  <div>selectVal1: {{ selectVal1 }}</div>
  <section>
    <OSelect v-model="selectVal1" placeholder="select..." clearable>
      <OOption :label="item.label" :value="item.value" v-for="item in options" :key="item.value" />
    </OSelect>
  </section>
</template>
<style lang="scss"></style>
