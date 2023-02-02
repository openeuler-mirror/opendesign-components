<script setup lang="ts">
import '../style';

import PopupPosition from './PopupPosition.vue';
import PopupVisible from './PopupVisible.vue';
import PopupContainer from './PopupContainer.vue';
import PopupTarget from './PopupTarget.vue';
</script>
<template>
  <div class="page-demo">
    <PopupTarget />
    <PopupContainer />
    <PopupPosition />
    <PopupVisible />
  </div>
</template>
<style lang="scss"></style>
