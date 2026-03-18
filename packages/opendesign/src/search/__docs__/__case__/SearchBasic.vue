<docs lang="md">
  <!-- zh-CN -->

### 基础搜索框

  <!-- en-US -->

### Basic search box
</docs>
<script setup lang="ts">
import { ref } from 'vue';

const inputVal = ref('');
</script>
<template>
  <OSearch v-model="inputVal" placeholder="搜索" />
</template>
