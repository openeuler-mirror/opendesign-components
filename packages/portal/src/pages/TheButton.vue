<script setup lang="ts">
import '@opensig/opendesign/src/components/button/style';

import BtnType from '@demo/button/__demo__/BtnType.vue';
import BtnSize from '@demo/button/__demo__/BtnSize.vue';
import BtnDisabled from '@demo/button/__demo__/BtnDisabled.vue';
import BtnIcon from '@demo/button/__demo__/BtnIcon.vue';
import BtnShape from '@demo/button/__demo__/BtnShape.vue';
</script>
<template>
  <div class="page-demo">
    <h4>Type</h4>
    <BtnType />
    <h4>Shape</h4>
    <BtnShape />
    <h4>Size</h4>
    <BtnSize />
    <h4>Disabled</h4>
    <BtnDisabled />
    <h4>Icon</h4>
    <BtnIcon />
  </div>
</template>
<style lang="scss"></style>
