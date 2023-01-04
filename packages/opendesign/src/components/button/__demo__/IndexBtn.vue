<script setup lang="ts">
import '../style';

import BtnType from './BtnType.vue';
import BtnSize from './BtnSize.vue';
import BtnDisabled from './BtnDisabled.vue';
import BtnIcon from './BtnIcon.vue';
import BtnShape from './BtnShape.vue';
import BtnLoading from './BtnLoading.vue';
</script>
<template>
  <div class="page-demo">
    <BtnType />
    <BtnShape />
    <BtnSize />
    <BtnDisabled />
    <BtnIcon />
    <BtnLoading />
  </div>
</template>
<style lang="scss"></style>
