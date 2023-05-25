<script setup lang="ts">
import { OInput } from '@components/index';
</script>
<template>
  <div class="page-demo">
    <h3>类型 & 尺寸</h3>
    <section>
      <span class="name"> M:</span>
      <OInput class="input" placeholder="hint" />
      <OInput class="input" type="password" placeholder="请输入密码" />
    </section>
    <section>
      <span class="name"> L:</span>
      <OInput class="input" size="large" placeholder="hint" />
      <OInput class="input" type="password" size="large" placeholder="请输入密码" />
    </section>
    <h3>禁用</h3>
    <section></section>
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
