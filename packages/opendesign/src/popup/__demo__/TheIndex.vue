<script setup lang="ts">
import '../style';

import PopupPosition from './PopupPosition.vue';
import PopupVisible from './PopupVisible.vue';
import PopupContainer from './PopupContainer.vue';
import PopupTarget from './PopupTarget.vue';
import PopupChangeTarget from './PopupChangeTarget.vue';
import PopupBeforeToggle from './PopupBeforeToggle.vue';
import PopupLeftWidth from './PopupLeftWidth.vue';
import PopupScrollContainer from './PopupScrollContainer.vue';
import PopupAsyncRace from './PopupAsyncRace.vue';
import PopupTargetListenerLeak from './PopupTargetListenerLeak.vue';
</script>
<template>
  <div class="page-demo">
    <PopupTarget />
    <PopupContainer />
    <PopupPosition />
    <PopupVisible />
    <PopupChangeTarget />
    <PopupBeforeToggle />
    <PopupLeftWidth />
    <PopupScrollContainer />
    <PopupAsyncRace />
    <PopupTargetListenerLeak />
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
