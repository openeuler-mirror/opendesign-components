<docs lang="md">
<!--zh-CN-->

### 单独使用

<!--en-US-->

### standalone
</docs>

<script setup lang="ts">
import { OToggle } from '@opensig/opendesign';
import { ref } from 'vue';
const checked1 = ref(true);
</script>

<template>
  <section>
    <OToggle v-model:checked="checked1" round="pill">Checked: {{ checked1 }}</OToggle>
    <OToggle disabled round="pill">Disabled</OToggle>
    <OToggle round="pill">3</OToggle>
  </section>
</template>
