<script setup lang="ts">
import { ref } from 'vue';
import { OTextarea } from '../index';

const val1 = ref('max Height: 300px <OTextarea v-model="val1" auto-height /> \n<OTextarea v-model="val1" auto-height />');
const val2 = ref('min Height: 100px');
setTimeout(() => {
  // val1.value = '123';
  val2.value = 'min-height: 200px; min-width: 200px <OTextarea v-model="val1" auto-height />';
}, 2000);
</script>
<template>
  <h4>Auto Height</h4>
  <div>
    <div>
      <OTextarea v-model="val1" auto-size style="width: 300px" clearable />
    </div>
    <div>
      <div>max-height: 120px:</div>
      <OTextarea v-model="val1" auto-size style="max-height: 120px" clearable />
    </div>
    <div>
      <div>min-height: 200px; min-width: 200px:</div>
      <OTextarea v-model="val2" auto-size style="min-height: 200px; min-width: 200px" clearable />
    </div>
  </div>
</template>
<style lang="scss"></style>
