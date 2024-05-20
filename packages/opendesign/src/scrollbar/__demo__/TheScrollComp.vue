<template>
  <div class="wrap" :style="{ height: height, width: width }">
    <button @click="change">chang height</button>
    <textarea name="" id="" cols="30" rows="5"></textarea>
    <div class="inner" style="height: 240px; width: 100vw"></div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';

const height = ref('300px');
const width = ref('50vw');
const change = () => {
  height.value = '400px';
  width.value = '40vw';
};
</script>
<style>
.wrap {
  background-color: #edecec;
  overflow: auto;
  padding: 10px;
}
.inner {
  background-color: #93f6ac;
}
</style>
