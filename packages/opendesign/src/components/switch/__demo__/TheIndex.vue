<script setup lang="ts">
import '../style';

import SwitchSize from './SwitchSize.vue';
import SwitchRound from './SwitchRound.vue';
import SwitchDisabled from './SwitchDisabled.vue';
import SwitchLoading from './SwitchLoading.vue';
import SwitchBeforeChange from './SwitchBeforeChange.vue';
import SwitchEvents from './SwitchEvents.vue';
import SwitchSlots from './SwitchSlots.vue';
</script>

<template>
  <div class="page-demo">
    <SwitchSize />
    <SwitchRound />
    <SwitchDisabled />
    <SwitchLoading />
    <SwitchBeforeChange />
    <SwitchEvents />
    <SwitchSlots />
  </div>
</template>
