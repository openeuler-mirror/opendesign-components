<script setup lang="ts">
import '@opensig/opendesign/es/switch/style';

import SwitchShape from '@demo/switch/__demo__/SwitchShape.vue';
import SwitchSize from '@demo/switch/__demo__/SwitchSize.vue';
import SwitchDisabledAndLoading from '@demo/switch/__demo__/SwitchDisabledAndLoading.vue';
import SwitchBeforeChange from '@demo/switch/__demo__/SwitchBeforeChange.vue';
import SwitchSlots from '@demo/switch/__demo__/SwitchSlots.vue';
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
