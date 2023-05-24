<script setup lang="ts">
import { ref } from 'vue';
import { ORadio } from '@components/index';
const radioVal1 = ref(1);
const radioVal2 = ref('1');
</script>

<template>
  <div class="page-demo">
    <h3>选中&未选中</h3>
    <section>
      <ORadio v-model="radioVal1" :value="1">选项1</ORadio>
      <ORadio v-model="radioVal1" :value="2">选项2</ORadio>
    </section>

    <h3>禁用</h3>
    <section>
      <ORadio v-model="radioVal2" value="1" disabled>选项1</ORadio>
      <ORadio v-model="radioVal2" value="2" disabled>选项2</ORadio>
    </section>
  </div>
</template>
