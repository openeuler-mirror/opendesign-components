<script setup lang="ts">
import { ref } from 'vue';
import { OInput } from '../index';
import { IconDone } from '../../icons';

const val1 = ref('');
const val2 = ref('this is input value');
const val3 = ref(`${12345}`);
setTimeout(() => {
  val2.value += '---';
}, 2000);
</script>
<template>
  <div>val1:{{ val1 }}</div>
  <div>val2:{{ val2 }}</div>
  <div>val3:{{ val3 }}</div>
  <h4>type</h4>
  <section>
    <div>
      <section>
        <p>text:</p>
        <OInput v-model="val3" />
        <p>password:</p>
        <OInput v-model="val3" type="password" />
      </section>
    </div>
  </section>
  <h4>color</h4>
  <section>
    <div>
      <p>color: normal</p>
      <OInput v-model="val1" placeholder="outline input" />
    </div>
    <div>
      <p>color: success</p>
      <OInput v-model="val1" placeholder="outline input" color="success" />
    </div>
    <div>
      <p>color: warning</p>
      <OInput v-model="val1" placeholder="outline input" color="warning" />
    </div>
    <div>
      <p>color: danger</p>
      <OInput v-model="val1" placeholder="outline input" color="danger" />
    </div>
  </section>
  <h4>Size</h4>
  <section>
    <OInput v-model="val2" size="small" />
    <OInput v-model="val2" />
    <OInput v-model="val3" size="large" />
  </section>
  <h4>Readonly</h4>
  <section>
    <div>val1:{{ val1 }}</div>
    <OInput v-model="val2" readonly />
    <OInput v-model="val2" readonly>
      <template #prefix>
        <IconDone />
      </template>
    </OInput>
    <OInput v-model="val2" readonly>
      <template #suffix>
        <IconDone />
      </template>
    </OInput>
    <OInput v-model="val2" :clearable="false" readonly>
      <template #suffix> 元 </template>
    </OInput>
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
