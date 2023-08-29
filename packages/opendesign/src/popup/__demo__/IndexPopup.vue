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
<style lang="scss">
.popup-box {
  background-color: var(--o-color-fill2);
  box-shadow: var(--o-shadow-1);
  padding: 4px 8px;
  border-radius: var(--o-radius_control-xs);
  border: 1px solid red;
}
</style>
