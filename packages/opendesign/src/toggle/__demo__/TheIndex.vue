<script setup lang="ts">
import '../style';

import ToggleCheckbox from './ToggleCheckbox.vue';
import ToggleMinAndMax from './ToggleMinAndMax.vue';
import ToggleOnly from './ToggleOnly.vue';
import ToggleRadio from './ToggleRadio.vue';
</script>

<template>
  <div class="page-demo">
    <ToggleOnly />
    <ToggleRadio />
    <ToggleCheckbox />
    <ToggleMinAndMax />
  </div>
</template>
