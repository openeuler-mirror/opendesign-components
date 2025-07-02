<script setup lang="ts">
import '../style';
import '../../option/style';

import TextareaBasic from './TextareaBasic.vue';
import TextareaAutoHeight from './TextareaAutoHeight.vue';
import TextareaSlot from './TextareaSlot.vue';
import TextareaEvent from './TextareaEvent.vue';
</script>
<template>
  <div class="page-demo">
    <TextareaEvent />
    <TextareaBasic />
    <TextareaAutoHeight />
    <TextareaSlot />
  </div>
</template>
<style lang="scss"></style>
