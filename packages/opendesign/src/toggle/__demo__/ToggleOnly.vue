<script setup lang="ts">
import { OToggle } from '../../index';
import { ref } from 'vue';
const checked1 = ref(true);
</script>

<template>
  <h3>单独使用</h3>
  <section>
    <OToggle v-model:checked="checked1">Checked: {{ checked1 }}</OToggle>
    <OToggle disabled>Disabled</OToggle>
    <OToggle>3</OToggle>
  </section>
</template>
