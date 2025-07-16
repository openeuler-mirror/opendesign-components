<docs lang="md">
<!-- zh-CN -->

### 按钮圆角形状

通过`round`属性设置按钮圆角形状，值为`pill`时指半圆角，值也可以是css属性`border-radius`可接受的任意值

<!-- en-US -->

### Button Round Shape

Sets the button's rounded shape. A value of 'pill' specifies a half-rounded shape. Any valid CSS border-radius length value (e.g., '8px', '50%') can be used.
</docs>
<script setup lang="ts">
import { OButton } from '@opensig/opendesign';
import { OIconAdd } from '@opensig/opendesign';
import { ref } from 'vue';

const r = ref(12);
const onClick = () => {
  if (r.value <= 0) {
    r.value += 16;
  } else {
    r.value -= 2;
  }
};
</script>
<template>
  <div class="row">
    <div>
      <p>round="pill"</p>
      <section>
        <OButton variant="solid" size="large" round="pill">
          <template #icon><OIconAdd /></template>
        </OButton>
        <OButton variant="outline" round="pill">
          <template #icon><OIconAdd /></template>
        </OButton>
        <OButton variant="text" size="small" round="pill">
          <template #icon><OIconAdd /></template>
        </OButton>
      </section>
    </div>
    <div>
      <p>round="{{ r }}px"</p>
      <section>
        <OButton variant="solid" size="large" :round="r + 'px'" @click="onClick">
          <template #icon><OIconAdd /></template>Click To Change Round
        </OButton>
        <OButton variant="outline" :round="r + 'px'">
          <template #icon><OIconAdd /></template>Round Button
        </OButton>
        <OButton variant="text" size="small" :round="r + 'px'">
          <template #icon><OIconAdd /></template>Round Button
        </OButton>
      </section>
    </div>
  </div>
</template>
