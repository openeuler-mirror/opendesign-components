<script setup lang="ts">
import ScrollbarBasic from './ScrollbarBasic.vue';
import ScrollerBasic from './ScrollerBasic.vue';
import ScrollbarTarget from './ScrollbarTarget.vue';
import '../style';
import ScrollerHeight from './ScrollerHeight.vue';
import ScrollerHooks from './ScrollerHooks.vue';
import ScrollerBodyDemo from './ScrollerBodyDemo.vue';
</script>
<template>
  <div class="page-demo">
    <ScrollbarBasic />
    <ScrollerBasic />
    <ScrollerBodyDemo />
    <ScrollbarTarget />
    <ScrollerHeight />
    <ScrollerHooks />
  </div>
</template>
<style lang="scss"></style>
