<script setup lang="ts">
import '../style';
import '../../checkbox-group/style';

import CheckboxBasic from './CheckboxBasic.vue';
import CheckboxDisabled from './CheckboxDisabled.vue';
import CheckboxSlots from './CheckboxSlots.vue';
import CheckboxGroup from './CheckboxGroup.vue';
import CheckboxEvents from './CheckboxEvents.vue';
import CheckboxIndeterminate from './CheckboxIndeterminate.vue';
import CheckboxGroupLimit from './CheckboxGroupLimit.vue';
</script>

<template>
  <div class="page-demo">
    <CheckboxBasic />
    <CheckboxDisabled />
    <CheckboxSlots />
    <CheckboxGroup />
    <CheckboxEvents />
    <CheckboxGroupLimit />
    <CheckboxIndeterminate />
  </div>
</template>
