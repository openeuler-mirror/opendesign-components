<docs lang="md">
<!-- zh-CN -->

### 尺寸

通过 `size` 属性设置组件尺寸。

<!-- en-US -->

### Component

Create a loading animation using the `OLoading` component.

Set the mount container for the loading animation via the `wrapper` property. For details, see [OLayer.wrapper](/en-US/components/layer#usage)
</docs>
<script setup lang="ts">
import { ref } from 'vue';
import { OLoading, OButton, useLoading } from '@opensig/opendesign';

const visible = ref(false);

const handleClick = () => {
  visible.value = !visible.value;
};

</script>
<template>
  <OButton @click="handleClick">Click to load</OButton>
  <!-- The loading mount to container -->
   <div style="display: flex; gap: 24px; margin: 20px;">
    <div class="container">mini
      <OLoading v-model:visible="visible" :wrapper="null" size="mini"/>
    </div>
    <div class="container">small
      <OLoading v-model:visible="visible" :wrapper="null" label="loading..." />
    </div>
    <div class="container">medium
      <OLoading v-model:visible="visible" :wrapper="null" label="loading..." size="medium"/>
    </div>
    <div class="container" style="">large
      <OLoading v-model:visible="visible" :wrapper="null" label="loading..." size="large"/>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.container {
  position: relative;
  width: 300px;
  height: 200px; 
  background-color: #eee;
}
</style>
