<script setup lang="ts">
import { OInput } from '@components/index';
import { ref } from 'vue';
const val = ref('This is detail');
const val2 = ref('This is detail');
</script>
<template>
  <div class="page-demo">
    <h3>类型 & 尺寸</h3>
    <section>
      <span class="name"> M:</span>
      <OInput class="input" placeholder="hint" />
      <OInput v-model="val" class="input" placeholder="hint" />
      <OInput class="input" type="password" placeholder="请输入密码" />
      <OInput v-model="val2" class="input" type="password" placeholder="请输入密码" />
    </section>
    <section>
      <span class="name"> L:</span>
      <OInput class="input" size="large" placeholder="hint" />
      <OInput v-model="val" class="input" size="large" placeholder="hint" />
      <OInput class="input" type="password" size="large" placeholder="请输入密码" />
      <OInput v-model="val2" class="input" type="password" size="large" placeholder="请输入密码" />
    </section>
    <h3>禁用</h3>
    <section>
      <OInput class="input" placeholder="hint" disabled />
      <OInput v-model="val" class="input" placeholder="hint" disabled />
      <OInput class="input" type="password" placeholder="请输入密码" disabled />
      <OInput v-model="val2" class="input" type="password" placeholder="请输入密码" disabled />
    </section>
    <h3>Error</h3>
    <section>
      <OInput class="input" placeholder="hint" color="danger" />
      <OInput v-model="val" class="input" placeholder="hint" color="danger" />
      <OInput class="input" size="large" placeholder="hint" color="danger" />
      <OInput v-model="val2" class="input" size="large" placeholder="hint" color="danger" disabled />
    </section>
  </div>
</template>
<style lang="scss">
.name {
  width: 40px;
}
.input {
  width: 240px;
}
</style>
