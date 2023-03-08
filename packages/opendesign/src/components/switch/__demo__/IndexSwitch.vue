<script setup lang="ts">
import '../style';

import SwitchBasic from './SwitchBasic.vue';
import SwitchRound from './SwitchRound.vue';
import SwitchDisabledAndLoading from './SwitchDisabledAndLoading.vue';
import SwitchBeforeChange from './SwitchBeforeChange.vue';
import SwitchEvents from './SwitchEvents.vue';
import SwitchSlots from './SwitchSlots.vue';
</script>

<template>
  <div class="page-demo">
    <SwitchBasic />
    <SwitchRound />
    <SwitchDisabledAndLoading />
    <SwitchBeforeChange />
    <SwitchEvents />
    <SwitchSlots />
  </div>
</template>
