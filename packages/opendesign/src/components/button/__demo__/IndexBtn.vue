<script setup lang="ts">
import '../style';

import BtnType from './BtnType.vue';
import BtnSize from './BtnSize.vue';
import BtnDisabled from './BtnDisabled.vue';
import BtnIcon from './BtnIcon.vue';
import BtnShape from './BtnShape.vue';
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
