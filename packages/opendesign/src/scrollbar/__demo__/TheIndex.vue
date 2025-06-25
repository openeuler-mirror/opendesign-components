<script setup lang="ts">
import ScrollbarBasic from './ScrollbarBasic.vue';
import ScrollerBasic from './ScrollerBasic.vue';
import ScrollbarTarget from './ScrollbarTarget.vue';
import '../style';
import ScrollerSize from './ScrollerSize.vue';
import ScrollerHooks from './ScrollerHooks.vue';
import ScrollerBodyDemo from './ScrollerBodyDemo.vue';
import ScrollbarDirective from './ScrollbarDirective.vue';
</script>
<template>
  <div class="page-demo">
    <ScrollbarBasic />
    <ScrollerBasic />
    <ScrollerBodyDemo />
    <ScrollbarTarget />
    <ScrollerSize />
    <ScrollerHooks />
    <ScrollbarDirective />
  </div>
</template>
<style lang="scss"></style>
