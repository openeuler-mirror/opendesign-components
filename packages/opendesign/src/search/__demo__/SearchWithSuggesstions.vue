<script setup lang="ts">
import { ref } from 'vue';
import { OSearch } from '../index';

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
  <h4>联想搜索框</h4>
  <p>联想词：模型</p>
  <section><OSearch v-model="inputVal" placeholder="搜索" :suggesstions="suggesstions" clearable /></section>
</template>
