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
      <ODatePicker v-model="val1" placeholder="normal + outline" resize="none" color="normal" />
      <ODatePicker v-model="val1" placeholder="normal + outline" resize="none" color="success" />
      <ODatePicker v-model="val1" placeholder="normal + outline" resize="none" color="warning" />
      <ODatePicker v-model="val1" placeholder="normal + outline" resize="none" color="danger" />
      <ODatePicker v-model="val1" placeholder="normal + outline disabled" resize="none" disabled />
      <ODatePicker v-model="val1" placeholder="normal + outline readonly" resize="none" readonly />
    </div>
    <div class="row">
      <ODatePicker v-model="val1" placeholder="normal + solid" resize="none" color="normal" variant="solid" />
      <ODatePicker v-model="val1" placeholder="success + solid" resize="none" color="success" variant="solid" />
      <ODatePicker v-model="val1" placeholder="warning + solid" resize="none" color="warning" variant="solid" />
      <ODatePicker v-model="val1" placeholder="danger + solid" resize="none" color="danger" variant="solid" />
      <ODatePicker v-model="val1" placeholder="normal + solid disabled" resize="none" disabled variant="solid" />
      <ODatePicker v-model="val1" placeholder="normal + solid readonly" resize="none" readonly variant="solid" />
    </div>

    <div class="row">
      <ODatePicker v-model="val1" placeholder="normal + solid" resize="none" color="normal" variant="solid" size="small" />
      <ODatePicker v-model="val1" placeholder="success + solid" resize="none" color="success" variant="solid" size="small" />
      <ODatePicker v-model="val1" placeholder="warning + solid" resize="none" color="warning" variant="solid" size="small" />
      <ODatePicker v-model="val1" placeholder="danger + solid" resize="none" color="danger" variant="solid" size="small" />
      <ODatePicker v-model="val1" placeholder="normal + solid disabled" resize="none" disabled variant="solid" size="small" />
      <ODatePicker v-model="val1" placeholder="normal + solid readonly" resize="none" readonly variant="solid" size="small" />
    </div>

    <div class="row">
      <ODatePicker v-model="val1" placeholder="normal + solid" resize="none" color="normal" variant="solid" size="large" />
      <ODatePicker v-model="val1" placeholder="success + solid" resize="none" color="success" variant="solid" size="large" />
      <ODatePicker v-model="val1" placeholder="warning + solid" resize="none" color="warning" variant="solid" size="large" />
      <ODatePicker v-model="val1" placeholder="danger + solid" resize="none" color="danger" variant="solid" size="large" />
      <ODatePicker v-model="val1" placeholder="normal + solid disabled" resize="none" disabled variant="solid" size="large" />
      <ODatePicker v-model="val1" placeholder="normal + solid readonly" resize="none" readonly variant="solid" size="large" />
    </div>
  </section>
</template>
<style lang="scss"></style>
