<script setup lang="ts">
import { ref } from 'vue';
import { ODatePicker } from '../index';

const val1 = ref(1687156310181);
</script>
<template>
  <h4>Color & Variant</h4>
  <section>
    <div>Outline</div>
    <div class="row">
      <ODatePicker v-model="val1" placeholder="normal + outline" resize="none" />
    </div>
  </section>
</template>
<style lang="scss"></style>
