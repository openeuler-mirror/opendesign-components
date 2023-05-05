<script setup lang="ts">
import '../style';
import '../../option/style';

import SelectBasic from './SelectBasic.vue';
import SelectPopupposition from './SelectPopupposition.vue';
</script>
<template>
  <div class="page-demo">
    <SelectBasic />
    <SelectPopupposition />
  </div>
</template>
<style lang="scss">
.page-demo {
  padding-bottom: 100px;
}
</style>
