<script setup lang="ts">
import { ref } from 'vue';
import { OInput } from '../index';
import { IconDone } from '../../icons';

const val1 = ref('');
const val2 = ref('this is input value');
const val3 = ref(`${12345}`);
const val4 = ref(12345);
setTimeout(() => {
  val2.value += '---';
}, 2000);

const printEvent = (event: string, val?: string | number) => {
  console.log(`[${event}]`, val);
};
</script>
<template>
  <h4>Basic</h4>
  <section>
    <div>val1:{{ val1 }}</div>
    <OInput v-model="val1" />
    <div>val2:{{ val2 }}</div>
    <OInput
      v-model="val2"
      @blur="(v) => printEvent('blur', v)"
      @change="(v) => printEvent('change', v)"
      @input="(v) => printEvent('input', v)"
      @focus="(v) => printEvent('focus', v)"
      @clear="(v) => printEvent('clear')"
      @press-enter="(v) => printEvent('press-enter', v)"
    />
    <OInput v-model="val3" />
    <OInput v-model="val3" type="password" />
  </section>
  <h4>Size</h4>
  <section>
    <div>val1:{{ val1 }}</div>
    <OInput v-model="val2" size="small" />
    <OInput v-model="val2" />
    <OInput v-model="val3" size="large" />
  </section>
  <h4>Shape</h4>
  <section>
    <div>val1:{{ val1 }}</div>
    <OInput v-model="val2" size="small" shape="round" />
    <OInput v-model="val2" shape="round" />
    <OInput v-model="val3" size="large" shape="round" />
    <OInput v-model="val2" disabled shape="round">
      <template #prefix><IconDone /></template>
      <template #suffix> 元 </template>
    </OInput>
    <OInput v-model="val2" shape="round">
      <template #prepend>+86</template>
      <template #append>手机</template>
    </OInput>
  </section>
  <h4>Status</h4>
  <section>
    <div>val1:{{ val1 }}</div>
    <OInput v-model="val2" status="success" />
    <OInput v-model="val2" status="warning" />
    <OInput v-model="val2" status="error" />
  </section>
  <h4>Disabled</h4>
  <section>
    <div>val1:{{ val1 }}</div>
    <OInput v-model="val2" disabled />
    <OInput v-model="val2" disabled>
      <template #prefix>
        <IconDone />
      </template>
    </OInput>
    <OInput v-model="val2" disabled>
      <template #suffix>
        <IconDone />
      </template>
    </OInput>
    <OInput v-model="val2" :clearable="false" disabled>
      <template #suffix> 元 </template>
    </OInput>
  </section>
</template>
<style lang="scss"></style>
