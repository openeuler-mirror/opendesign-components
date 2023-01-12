<script setup lang="ts">
import '../style';
import '../../radio-group/style';

import RadioBasic from './RadioBasic.vue';
import RadioDisabled from './RadioDisabled.vue';
import RadioSlots from './RadioSlots.vue';
import RadioGroup from './RadioGroup.vue';
import RadioEvents from './RadioEvents.vue';
</script>

<template>
  <div class="page-demo">
    <RadioBasic />
    <RadioDisabled />
    <RadioSlots />
    <RadioGroup />
    <RadioEvents />
  </div>
</template>
