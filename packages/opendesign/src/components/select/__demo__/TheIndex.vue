<script setup lang="ts">
import '../style';
import '../../option/style';

import SelectBasic from './SelectBasic.vue';
import SelectMultiple from './SelectMultiple.vue';
import SelectPopupposition from './SelectPopupposition.vue';
import SelectLoading from './SelectLoading.vue';
</script>
<template>
  <div class="page-demo">
    <!-- <SelectBasic /> -->
    <SelectMultiple />
    <!-- <SelectLoading /> -->
    <!-- <SelectPopupposition /> -->
  </div>
</template>
<style lang="scss">
.page-demo {
  padding-bottom: 100px;
}
</style>
