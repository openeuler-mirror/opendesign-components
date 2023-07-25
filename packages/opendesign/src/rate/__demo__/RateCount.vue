<script setup lang="ts">
import { ref } from 'vue';
import { ORate } from '../index';

const rateVal = ref(0);
const count = 10;
</script>

<template>
  <h4>自定义评分数量</h4>
  <section>
    <ORate v-model="rateVal" :count="count" />
  </section>
</template>
