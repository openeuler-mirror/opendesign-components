<script setup lang="ts">
import { ref } from 'vue';
import { OTextarea } from '../index';

const val1 = ref('max Height: 300px <OTextarea v-model="val1" auto-height /> <OTextarea v-model="val1" auto-height />');
const val2 = ref('min Height: 100px');
setTimeout(() => {
  val1.value = '123';
  val2.value = 'max Height: 300px <OTextarea v-model="val1" auto-height />';
}, 2000);
</script>
<template>
  <h4>Auto Height</h4>
  <section>
    <div>
      <OTextarea v-model="val1" auto-height />
    </div>
    <div>
      max-height: 120px:
      <OTextarea v-model="val1" auto-height style="max-height: 120px" />
    </div>
    <div>
      min-height: 200px:
      <OTextarea v-model="val2" auto-height style="min-height: 200px" />
    </div>
  </section>
</template>
<style lang="scss"></style>
