<script setup lang="ts">
import { ref } from 'vue';
import { DayCellT, ODatePicker, ShortcutParamT, ODateRangePicker } from '../index';

const val1 = ref<string | Date | number>('2011-11');
const val2 = ref<Array<string | Date | number>>(['2011', '2023']);

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
    label: '30天前',
    value: () => new Date(new Date().getTime() - 30 * 24 * 1000 * 60 * 60),
  },
  {
    label: 'yesterday',
    value: () => new Date(new Date().getTime() - 24 * 1000 * 60 * 60),
  },
];

const disableCell = (cell: DayCellT): boolean => {
  // const y = date.getFullYear();
  // const m = date.getMonth();
  // const d = date.getDate();
  // return y < 2022 || y > 2027 || Boolean(m % 2) || Boolean(d % 2);
  // return Boolean(d % 2);
  // console.log(cell);

  return Boolean(cell.day % 2);
};

const displayMonthList = () => {
  return [
    { month: 0, label: '1月' },
    { month: 1, label: '2月' },
    { month: 2, label: '3月' },
    { month: 3, label: '4月' },
  ];
};

const disableTimeCell = (value: number, type: 'hour' | 'minute' | 'second'): boolean => {
  return !Boolean(value % 3);
};
const fs = 'yyyy-MM';
const fs2 = '';

// range

const onRangeChange = (value: Array<string | Date | number>) => {
  console.log('change', value);
};

const onRangeFocus = (value: Array<string | Date | number>) => {
  console.log('focus', value);
};
const onRangeBlur = (value: Array<string | Date | number>) => {
  console.log('blur', value);
};

const onRangeClear = (e?: Event) => {
  console.log('clear', e);
};

const onRangePressEnter = (value: Array<string>, e: KeyboardEvent) => {
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
        mode="month"
        :format-string="fs"
        placeholder="请选择..."
        resize="none"
        color="normal"
        :shortcuts="shortcuts"
        confirm-label="ok"
        style="width: 400px"
        :disable-cell="disableCell"
        :disable-time-cell="disableTimeCell"
        :select-year="true"
        :display-month-list="displayMonthList"
        @focus="onFocus"
        @blur="onBlur"
        @change="onChange"
        @clear="onClear"
        @press-enter="onPressEnter"
      />
      <ODateRangePicker
        v-model="val2"
        mode="year-range"
        :format-string="fs2"
        placeholder="请选择..."
        resize="none"
        color="normal"
        :shortcuts="shortcuts"
        :year-selectable="false"
        confirm-label="ok"
        style="width: 400px"
        :disable-cell="disableCell"
        :disable-time-cell="disableTimeCell"
        :select-year="true"
        :display-month-list="displayMonthList"
        @focus="onRangeFocus"
        @blur="onRangeBlur"
        @change="onRangeChange"
        @clear="onRangeClear"
        @press-enter="onRangePressEnter"
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
