<script setup lang="ts">
import '../style';
import ProgressBasic from './ProgressBasic.vue';
import ProgressColor from './ProgressColor.vue';
import ProgressCustom from './ProgressCustom.vue';
import ProgressCircle from './ProgressCircle.vue';
import ProgressStrokeWidth from './ProgressStrokeWidth.vue';
import ProgressLabelInside from './ProgressLabelInside.vue';
</script>

<template>
  <div class="page-demo">
    <ProgressBasic />
    <ProgressCustom />
    <ProgressColor />
    <ProgressCircle />
    <ProgressStrokeWidth />
    <ProgressLabelInside />
  </div>
</template>
