<script setup lang="ts">
import '../style';
import '../../option/style';

import SelectBasic from './SelectBasic.vue';
import SelectMultiple from './SelectMultiple.vue';
import SelectPopupposition from './SelectPopupposition.vue';
import SelectLoading from './SelectLoading.vue';
import SelectGroup from './SelectGroup.vue';
import SelectTest from './SelectTest.vue';
</script>
<template>
  <div class="page-demo">
    <SelectBasic />
    <SelectMultiple />
    <SelectLoading />
    <SelectPopupposition />
    <SelectGroup />
    <SelectTest />
  </div>
</template>
<style lang="scss">
.page-demo {
  padding-bottom: 100px;
}
</style>
