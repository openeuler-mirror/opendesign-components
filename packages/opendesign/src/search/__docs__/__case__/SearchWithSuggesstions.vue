<docs lang="md">
  <!-- zh-CN -->

### 联想搜索框

联想词：模型

  <!-- en-US -->

### Association search box

Final translation: Model
</docs>
<script setup lang="ts">
import { ref } from 'vue';

const inputVal = ref('');

const suggesstions = [
  { label: '模型关键词选项一', value: '模型关键词选项一' },
  { label: '模型关键词选项二', value: '模型关键词选项二' },
  { label: '模型关键词选项三', value: '模型关键词选项三' },
  { label: '模型关键词选项四', value: '模型关键词选项四' },
  { label: '模型关键词选项五', value: '模型关键词选项五' },
];
</script>
<template>
  <OSearch v-model="inputVal" placeholder="搜索" :suggesstions="suggesstions" />
</template>
