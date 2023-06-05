<script setup lang="ts">
import { OButtonToggle } from '../index';
</script>

<template>
  <h4>基础用法</h4>
  <section>
    <OButtonToggle>筛选条件1</OButtonToggle>
    <OButtonToggle>筛选条件2</OButtonToggle>
    <OButtonToggle>筛选条件3</OButtonToggle>
    <OButtonToggle :default-checked="true"> 筛选条件 </OButtonToggle>
  </section>
</template>
