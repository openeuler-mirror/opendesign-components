<script setup lang="ts">
import '../style';

import SwitchSizeShape from './SwitchSizeShape.vue';
import SwitchDisabledAndLoading from './SwitchDisabledAndLoading.vue';
import SwitchBeforeChange from './SwitchBeforeChange.vue';
import SwitchSlots from './SwitchSlots.vue';
</script>
<template>
  <div class="page-demo">
    <SwitchSizeShape />
    <SwitchDisabledAndLoading />
    <SwitchBeforeChange />
    <SwitchSlots />
  </div>
</template>
