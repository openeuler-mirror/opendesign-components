<script setup lang="ts">
import { ref } from 'vue';
import { ORadio } from '@components/index';
const radioVal = ref(1);
</script>

<template>
  <h3>选中&未选中</h3>
  <section>
    <ORadio v-model="radioVal" :value="1">选项1</ORadio>
    <ORadio v-model="radioVal" :value="2">选项2</ORadio>
  </section>
</template>
