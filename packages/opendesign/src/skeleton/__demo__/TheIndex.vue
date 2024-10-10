<script setup lang="ts">
import '../style';

import SkeletonBasic from './SkeletonBasic.vue';
import SkeletonAnimation from './SkeletonAnimation.vue';
import SkeletonLoading from './SkeletonLoading.vue';
</script>

<template>
  <div class="page-demo">
    <SkeletonBasic />
    <SkeletonAnimation />
    <SkeletonLoading />
  </div>
</template>
