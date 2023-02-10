<script setup lang="ts">
import '../style';
import '../../option/style';

import InputBasic from './InputBasic.vue';
import InputEvent from './InputEvent.vue';
import InputSlot from './InputSlot.vue';
import InputMethod from './InputMethod.vue';
import InputAutoWidth from './InputAutoWidth.vue';
</script>
<template>
  <div class="page-demo">
    <InputAutoWidth />
    <InputBasic />
    <InputEvent />
    <InputSlot />
    <InputMethod />
  </div>
</template>
<style lang="scss"></style>
