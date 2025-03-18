<script setup lang="ts">
import { ref } from 'vue';
import { OInput } from '../index';
import { OIconDone } from '../../icon-components';

const val1 = ref('');
const val2 = ref('this is input value');
const val3 = ref(`${12345}`);
setTimeout(() => {
  val2.value += '---';
}, 2000);

const check = (val: string) => Boolean(Number(val) % 2);
</script>
<template>
  <div>val1:{{ val1 }}</div>
  <div>val2:{{ val2 }}</div>
  <div>val3:{{ val3 }}</div>
  <h4>type</h4>
  <section>
    <div>
      <div class="row">
        <p>text:</p>
        <OInput v-model="val1" :max-length="5" :min-length="2" class="abc" style="width: 200px" />
        <p>password:</p>
        <OInput v-model="val3" type="password" disabled style="width: 300px" />
      </div>
    </div>
  </section>
  <h4>color & variant</h4>
  <section>
    <div class="row">
      <OInput v-model="val1" placeholder="outline + normal" :validate="check" clearable />
      <OInput v-model="val1" placeholder="outline + success" color="success" clearable />
      <OInput v-model="val1" placeholder="outline + warning" color="warning" clearable />
      <OInput v-model="val1" placeholder="outline + danger" color="danger" clearable />
    </div>
    <div class="row">
      <OInput v-model="val1" color="normal" placeholder="outline + normal" :check-valid="check">
        <template #prepend><span style="padding: 0 8px">+86</span></template>
        <template #append><span style="padding: 0 8px">手机</span></template>
      </OInput>
      <OInput v-model="val1" color="success" placeholder="outline + success">
        <template #prepend><span style="padding: 0 8px">+86</span></template>
        <template #append><span style="padding: 0 8px">手机</span></template>
      </OInput>
      <OInput v-model="val1" color="warning" placeholder="outline + warning">
        <template #prepend><span style="padding: 0 8px">+86</span></template>
        <template #append><span style="padding: 0 8px">手机</span></template>
      </OInput>
      <OInput v-model="val1" color="danger" placeholder="outline + danger">
        <template #prepend><span style="padding: 0 8px">+86</span></template>
        <template #append><span style="padding: 0 8px">手机</span></template>
      </OInput>
    </div>
    <div class="row">
      <OInput v-model="val1" variant="solid" placeholder="solid + normal" />
      <OInput v-model="val1" variant="solid" placeholder="solid + success" color="success" />
      <OInput v-model="val1" variant="solid" placeholder="solid + warning" color="warning" />
      <OInput v-model="val1" variant="solid" placeholder="solid + danger" color="danger" />
    </div>

    <div class="row">
      <OInput v-model="val1" color="normal" variant="solid" placeholder="solid + normal">
        <template #prepend><span style="padding: 0 8px">+86</span></template>
        <template #append><span style="padding: 0 8px">手机</span></template>
      </OInput>
      <OInput v-model="val1" color="success" variant="solid" placeholder="solid + success">
        <template #prepend><span style="padding: 0 8px">+86</span></template>
        <template #append><span style="padding: 0 8px">手机</span></template>
      </OInput>
      <OInput v-model="val1" color="warning" variant="solid" placeholder="solid + warning">
        <template #prepend><span style="padding: 0 8px">+86</span></template>
        <template #append><span style="padding: 0 8px">手机</span></template>
      </OInput>
      <OInput v-model="val1" color="danger" variant="solid" placeholder="solid + danger">
        <template #prepend><span style="padding: 0 8px">+86</span></template>
        <template #append><span style="padding: 0 8px">手机</span></template>
      </OInput>
    </div>

    <div class="row">
      <OInput v-model="val1" variant="text" placeholder="text + normal" />
      <OInput v-model="val1" variant="text" placeholder="text + success" color="success" />
      <OInput v-model="val1" variant="text" placeholder="text + warning" color="warning" />
      <OInput v-model="val1" variant="text" placeholder="text + danger" color="danger" />
    </div>
  </section>
  <h4>Size</h4>
  <section>
    <OInput v-model="val2" size="small" clearable />
    <OInput v-model="val2" clearable />
    <OInput v-model="val3" size="large" clearable />
  </section>
  <h4>Readonly</h4>
  <section>
    <div>val1:{{ val1 }}</div>
    <OInput v-model="val2" readonly placeholder="readonly" />
    <OInput v-model="val2" readonly placeholder="readonly">
      <template #prefix>
        <OIconDone />
      </template>
    </OInput>
    <OInput v-model="val2" readonly placeholder="readonly">
      <template #suffix>
        <OIconDone />
      </template>
    </OInput>
    <OInput v-model="val2" :clearable="false" readonly placeholder="readonly">
      <template #suffix> 元 </template>
    </OInput>
  </section>
  <h4>Disabled</h4>
  <section>
    <div class="row">
      <OInput v-model="val3" placeholder="outline + normal" disabled />
      <OInput v-model="val3" placeholder="outline + success" color="success" disabled />
      <OInput v-model="val3" placeholder="outline + warning" color="warning" disabled />
      <OInput v-model="val3" placeholder="outline + danger" color="danger" disabled />
    </div>
    <div class="row">
      <OInput v-model="val3" variant="solid" placeholder="solid + normal" disabled />
      <OInput v-model="val3" variant="solid" placeholder="solid + success" color="success" disabled />
      <OInput v-model="val3" variant="solid" placeholder="solid + warning" color="warning" disabled />
      <OInput v-model="val3" variant="solid" placeholder="solid + danger" color="danger" disabled />
    </div>

    <div class="row">
      <OInput v-model="val3" variant="text" placeholder="text + normal" disabled />
      <OInput v-model="val3" variant="text" placeholder="text + success" color="success" disabled />
      <OInput v-model="val3" variant="text" placeholder="text + warning" color="warning" disabled />
      <OInput v-model="val3" variant="text" placeholder="text + danger" color="danger" disabled />
    </div>
    <div class="row">
      <OInput v-model="val1" color="normal" variant="solid" placeholder="solid + normal" disabled>
        <template #prepend><span style="padding: 0 8px">+86</span></template>
        <template #append><span style="padding: 0 8px">手机</span></template>
      </OInput>
      <OInput v-model="val1" color="success" variant="solid" placeholder="solid + success" disabled>
        <template #prepend><span style="padding: 0 8px">+86</span></template>
        <template #append><span style="padding: 0 8px">手机</span></template>
      </OInput>
      <OInput v-model="val1" color="warning" variant="solid" placeholder="solid + warning" disabled>
        <template #prepend><span style="padding: 0 8px">+86</span></template>
        <template #append><span style="padding: 0 8px">手机</span></template>
      </OInput>
      <OInput v-model="val1" color="danger" variant="solid" placeholder="solid + danger" disabled>
        <template #prepend><span style="padding: 0 8px">+86</span></template>
        <template #append><span style="padding: 0 8px">手机</span></template>
      </OInput>
    </div>
  </section>
</template>
<style lang="scss"></style>
