<script setup lang="ts">
import { OToggle } from '../index';
</script>

<template>
  <h4>基础用法</h4>
  <section>
    <OToggle>筛选条件1</OToggle>
    <OToggle>筛选条件2</OToggle>
    <OToggle>筛选条件3</OToggle>
    <OToggle :default-checked="true"> 筛选条件 </OToggle>
  </section>
</template>
