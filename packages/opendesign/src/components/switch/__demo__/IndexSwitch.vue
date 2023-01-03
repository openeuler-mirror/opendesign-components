<script setup lang="ts">
import '../style';

import SwitchShape from './SwitchShape.vue';
import SwitchSize from './SwitchSize.vue';
import SwitchDisabledAndLoading from './SwitchDisabledAndLoading.vue';
import SwitchBeforeChange from './SwitchBeforeChange.vue';
import SwitchSlots from './SwitchSlots.vue';
</script>
<template>
  <div class="page-demo">
    <h4>Shape</h4>
    <SwitchShape />
    <h4>Size</h4>
    <SwitchSize />
    <h4>Disabled & Loading</h4>
    <SwitchDisabledAndLoading />
    <h4>阻止切换</h4>
    <SwitchBeforeChange />
    <h4>插槽</h4>
    <SwitchSlots />
  </div>
</template>
