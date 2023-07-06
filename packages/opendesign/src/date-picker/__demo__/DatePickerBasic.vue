<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { ODatePicker } from '../index';

const val1 = ref(new Date());

const onChange = (value: string) => {
  console.log('change', value);
};

const onFocus = (value: string, e: Event) => {
  console.log('focus', value, e);
};
const onBlur = (value: string, e: Event) => {
  console.log('blur', value, e);
};

const onClear = (e?: Event) => {
  console.log('clear', e);
};

const onPressEnter = (value: string, e: KeyboardEvent) => {
  console.log('pressEnter', value, e);
};
</script>
<template>
  <h4>Color & Variant</h4>
  <section>
    <div>Outline</div>
    <p>value: {{ val1 }}</p>
    <div class="row">
      <ODatePicker
        v-model="val1"
        placeholder="normal + outline"
        resize="none"
        color="normal"
        @focus="onFocus"
        @blur="onBlur"
        @change="onChange"
        @clear="onClear"
        @press-enter="onPressEnter"
      />
      <!-- <ODatePicker v-model="val1" placeholder="normal + outline" resize="none" color="success" />
      <ODatePicker v-model="val1" placeholder="normal + outline" resize="none" color="warning" />
      <ODatePicker v-model="val1" placeholder="normal + outline" resize="none" color="danger" />
      <ODatePicker v-model="val1" placeholder="normal + outline disabled" resize="none" disabled />
      <ODatePicker v-model="val1" placeholder="normal + outline readonly" resize="none" readonly />
    </div>
    <div class="row">
      <ODatePicker v-model="val1" placeholder="normal + solid" resize="none" color="normal" variant="outline" round="pill" />
      <ODatePicker v-model="val1" placeholder="success + solid" resize="none" color="success" variant="outline" round="pill" />
      <ODatePicker v-model="val1" placeholder="warning + solid" resize="none" color="warning" variant="outline" round="pill" />
      <ODatePicker v-model="val1" placeholder="danger + solid" resize="none" color="danger" variant="outline" round="pill" />
      <ODatePicker v-model="val1" placeholder="normal + solid disabled" resize="none" disabled variant="outline" round="pill" />
      <ODatePicker v-model="val1" placeholder="normal + solid readonly" resize="none" readonly variant="outline" round="pill" />
    </div>

    <div class="row">
      <ODatePicker v-model="val1" placeholder="normal + solid" resize="none" color="normal" variant="solid" size="large" round="pill" />
      <ODatePicker v-model="val1" placeholder="success + solid" resize="none" color="success" variant="solid" size="large" round="pill" />
      <ODatePicker v-model="val1" placeholder="warning + solid" resize="none" color="warning" variant="solid" size="large" round="pill" />
      <ODatePicker v-model="val1" placeholder="danger + solid" resize="none" color="danger" variant="solid" size="large" round="pill" />
      <ODatePicker v-model="val1" placeholder="normal + solid disabled" resize="none" disabled variant="solid" size="large" round="pill" />
      <ODatePicker v-model="val1" placeholder="normal + solid readonly" resize="none" readonly variant="solid" size="large" round="pill" />
    </div>

    <div class="row">
      <ODatePicker v-model="val1" placeholder="normal + solid" resize="none" color="normal" variant="text" size="small" />
      <ODatePicker v-model="val1" placeholder="success + solid" resize="none" color="success" variant="text" size="small" />
      <ODatePicker v-model="val1" placeholder="warning + solid" resize="none" color="warning" variant="text" size="small" />
      <ODatePicker v-model="val1" placeholder="danger + solid" resize="none" color="danger" variant="text" size="small" />
      <ODatePicker v-model="val1" placeholder="normal + solid disabled" resize="none" disabled variant="text" size="small" />
      <ODatePicker v-model="val1" placeholder="normal + solid readonly" resize="none" readonly variant="text" size="small" /> -->
    </div>
  </section>
</template>
<style lang="scss"></style>
