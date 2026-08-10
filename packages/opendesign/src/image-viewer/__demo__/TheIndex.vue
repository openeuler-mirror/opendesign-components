<script setup lang="ts">
import { ref } from 'vue';
import ImageViewerBasic from '../__docs__/__case__/ImageViewerBasic.vue';
import ImageViewerInFigure from '../__docs__/__case__/ImageViewerInFigure.vue';
import ImageViewerStandalone from '../__docs__/__case__/ImageViewerStandalone.vue';
import ImageViewerFunctional from '../__docs__/__case__/ImageViewerFunctional.vue';
import ImageViewerError from '../__docs__/__case__/ImageViewerError.vue';
import { OSwitch } from '../../switch';

import '../style';
import '../../switch/style';

const showBaseDemo = ref(false);
</script>
<template>
  <div class="page-demo">
    <div class="demo-operation" style="display: flex; align-items: center">
      <h3 style="margin-right: 16px">切换demo</h3>
      <OSwitch v-model="showBaseDemo" round="pill" size="medium" />
    </div>
    <template v-if="!showBaseDemo">
      <ImageViewerBasic />
    </template>

    <template v-else>
      <ImageViewerStandalone />
      <ImageViewerError />
      <ImageViewerInFigure />
      <ImageViewerFunctional />
    </template>
  </div>
</template>
<style lang="scss"></style>
