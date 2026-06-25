<script setup lang="ts">
import { ref } from 'vue';
import { OPopup } from '../index';

const targetA = ref<HTMLElement>();
const targetB = ref<HTMLElement>();
const target = ref<HTMLElement>();
</script>
<template>
  <button ref="targetA" class="target" @click="target = targetA">target a</button>
  <button ref="targetB" class="target" @click="target = targetB">target b</button>
  <OPopup :target="target">popup target</OPopup>
</template>
<style>
.target {
  margin-bottom: 24px;
  cursor: pointer;
}
</style>
