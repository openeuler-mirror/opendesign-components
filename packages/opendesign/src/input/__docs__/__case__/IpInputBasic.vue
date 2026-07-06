<docs lang="md">
  <!-- zh-CN -->

#### ip地址输入框 ^[1.2.0](primary)

  <!-- en-US -->

#### IP address input box ^[1.2.0](primary)
</docs>
<script setup lang="ts">
import { ref } from 'vue';
import { OIpInput } from '@opensig/opendesign';

const inputVal = ref('192.168.1.1');
</script>
<template>
  <OIpInput v-model="inputVal" class="demo-ip-input" />
  <div class="show-ip">ip: {{ inputVal }}</div>
</template>
<style lang="scss" scoped>
.demo-ip-input {
  max-width: 220px;
}
.show-ip {
  margin-top: 8px;
  font-size: 16px;
  height: 24px;
}
</style>
