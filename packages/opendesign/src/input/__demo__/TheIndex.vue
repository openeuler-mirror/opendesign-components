<script setup lang="ts">
import '../style';
import '../../option/style';

import InputPopover from './InputPopover.vue';
import InputBasic from './InputBasic.vue';
import InputRound from './InputRound.vue';

import InputEvent from './InputEvent.vue';
import InputSlot from './InputSlot.vue';
import InputMethod from './InputMethod.vue';
import InputAutoWidth from './InputAutoWidth.vue';
import InputValid from './InputValid.vue';
import InputVerification from './InputVerification.vue';
</script>
<template>
  <div class="page-demo">
    <InputPopover />
    <InputBasic />
    <InputRound />
    <InputSlot />
    <InputEvent />
    <InputMethod />
    <InputValid />
    <InputAutoWidth />
    <InputVerification />
  </div>
</template>
<style lang="scss"></style>
