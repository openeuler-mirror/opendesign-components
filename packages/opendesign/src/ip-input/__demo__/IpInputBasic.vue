<script setup lang="ts">
import { ref } from 'vue';
import { OIpInput } from '../index';

const inputVal = ref('192.168.1.1');
</script>

<template>
  <h4>基础用法</h4>
  <section>
    <OIpInput v-model="inputVal" class="demo-ip-input" />
    <div class="show-ip">ip: {{ inputVal }}</div>
  </section>
</template>

<style lang="scss" scoped>
.demo-ip-input {
  max-width: 220px;
}
.show-ip {
  margin-top: 8px;
  font-size: 16px;
  height: 24px;
}
</style>
