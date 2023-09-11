<script setup lang="ts">
import { OInput } from '../index';
import { ref } from 'vue';
const val1 = ref('');

const r = ref(12);
const placeholder = 'please input';
const onClick = () => {
  if (r.value <= 0) {
    r.value += 16;
  } else {
    r.value -= 2;
  }
};
</script>
<template>
  <h4>Round</h4>
  <section>
    <div>
      <p>round="pill"</p>
      <section>
        <OInput v-model="val1" :placeholder="placeholder" round="pill" size="small" />
        <OInput v-model="val1" :placeholder="placeholder" round="pill" />
        <OInput v-model="val1" :placeholder="placeholder" round="pill" size="large" />
        <OInput v-model="val1" round="pill" size="small">
          <template #prepend><span style="padding: 0 4px">+86</span></template>
          <template #append><span style="padding: 0 4px">手机</span></template>
        </OInput>
        <OInput v-model="val1" round="pill" color="danger">
          <template #prepend><span style="padding: 0 8px">+86</span></template>
          <template #append><span style="padding: 0 8px">手机</span></template>
        </OInput>
        <OInput v-model="val1" round="pill" size="large">
          <template #prepend><span style="padding: 0 12px">+86</span></template>
          <template #append><span style="padding: 0 12px">手机</span></template>
        </OInput>
      </section>
    </div>
    <div>
      <p class="btn" @click="onClick">round="{{ r }}"</p>
      <section>
        <OInput v-model="val1" :placeholder="placeholder" :round="r + 'px'" size="small" />
        <OInput v-model="val1" :placeholder="placeholder" :round="r + 'px'" />
        <OInput v-model="val1" :placeholder="placeholder" :round="r + 'px'" size="large" />

        <OInput v-model="val1" :round="r + 'px'" size="small">
          <template #prepend><span style="padding: 0 4px">+86</span></template>
          <template #append><span style="padding: 0 4px">手机</span></template>
        </OInput>
        <OInput v-model="val1" :round="r + 'px'">
          <template #prepend><span style="padding: 0 8px">+86</span></template>
          <template #append><span style="padding: 0 8px">手机</span></template>
        </OInput>
        <OInput v-model="val1" :round="r + 'px'" size="large">
          <template #prepend><span style="padding: 0 12px">+86</span></template>
          <template #append><span style="padding: 0 12px">手机</span></template>
        </OInput>
      </section>
    </div>
  </section>
</template>
<style lang="scss">
.btn {
  cursor: pointer;
  user-select: none;
}
</style>
