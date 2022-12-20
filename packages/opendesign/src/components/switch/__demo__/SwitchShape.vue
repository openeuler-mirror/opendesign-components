<script setup lang="ts">
import { ref } from 'vue';
import { OSWitch, SwitchShapeT } from '../index';
const switchVal1 = ref(false);
const switchVal2 = ref(true);
</script>

<template>
  <section>
    <OSWitch v-model="switchVal1" :shape="SwitchShapeT.NORMAL" />
    <OSWitch v-model="switchVal2" :shape="SwitchShapeT.ROUND" />
  </section>
</template>
