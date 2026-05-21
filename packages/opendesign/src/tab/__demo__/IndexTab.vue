<script setup lang="ts">
import '../style';

import TabBasic from './TabBasic.vue';
import TabScroll from './TabScroll.vue';
import TabRefactor from './TabRefactor.vue';
import useSortedTeleportChildren from './useSortedTeleportChildren.vue';
</script>
<template>
  <div class="page-demo">
    <TabBasic />
    <TabScroll />
    <TabRefactor />
    <useSortedTeleportChildren />
  </div>
</template>
<style lang="scss"></style>
