<script setup lang="ts">
import '../style';
import '../../option/style';

import SelectSize from './SelectSize.vue';
import SelectShape from './SelectShape.vue';
import SelectDisabled from './SelectDisabled.vue';
import SelectPopupposition from './SelectPopupposition.vue';
</script>
<template>
  <div class="page-demo">
    <SelectSize />
    <SelectShape />
    <SelectDisabled />
    <SelectPopupposition />
  </div>
</template>
<style lang="scss"></style>
