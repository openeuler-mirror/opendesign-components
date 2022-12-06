<script setup lang="ts">
import '@opensig/opendesign/components/button/style';

import BtnType from '@demo/button/__demo__/BtnType.vue';
import BtnSize from '@demo/button/__demo__/BtnSize.vue';
import BtnDisabled from '@demo/button/__demo__/BtnDisabled.vue';
</script>
<template>
  <div class="page-demo">
    <h4>Type</h4>
    <BtnType />
    <h4>Size</h4>
    <BtnSize />
    <h4>Disabled</h4>
    <BtnDisabled />
  </div>
</template>
<style lang="scss"></style>
