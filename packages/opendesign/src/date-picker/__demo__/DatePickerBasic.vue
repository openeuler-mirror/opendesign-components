<script setup lang="ts">
import { ref } from 'vue';
import { ODatePicker, ShortcutParamT } from '../index';

const val1 = ref<string | Date | number>('2022-01-01 11:00');

const onChange = (value: string | Date | number) => {
  console.log('change', value);
};

const onFocus = (value: string | Date | number) => {
  console.log('focus', value);
};
const onBlur = (value: string | Date | number) => {
  console.log('blur', value);
};

const onClear = (e?: Event) => {
  console.log('clear', e);
};

const onPressEnter = (value: string, e: KeyboardEvent) => {
  console.log('pressEnter', value, e);
};

const shortcuts: ShortcutParamT[] = [
  'now',
  {
    label: '20天前',
    value: () => new Date(new Date().getTime() - 20 * 24 * 1000 * 60 * 60),
  },
  {
    label: 'yesterday',
    value: () => new Date(new Date().getTime() - 24 * 1000 * 60 * 60),
  },
];
</script>
<template>
  <h4>Color & Variant</h4>
  <section>
    <div>Outline</div>
    <p>value: {{ val1 }}</p>
    <div class="row">
      <ODatePicker
        v-model="val1"
        type="datetime"
        format-string="MM-dd HH:ss"
        placeholder="请选择..."
        resize="none"
        color="normal"
        :shortcuts="shortcuts"
        confirm-label="ok"
        style="width: 400px"
        @focus="onFocus"
        @blur="onBlur"
        @change="onChange"
        @clear="onClear"
        @press-enter="onPressEnter"
      >
        <template #day-cell="cell">{{ !cell.outView ? cell.data.days : `_${cell.data.days}` }}</template>
      </ODatePicker>
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
