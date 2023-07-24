<script setup lang="ts">
import '../style';
import { OMessage } from '../index';
</script>

<template>
  <h4>内联使用</h4>
  <section>
    <div>
      <OMessage status="info" colorful>用于表示普通操作信息提示</OMessage>
      <OMessage status="success" colorful>用于表示操作顺利达成</OMessage>
      <OMessage status="warning" colorful>用于表示操作引起一定后果</OMessage>
      <OMessage status="danger" colorful>用于表示操作引起严重的后果</OMessage>
      <OMessage status="loading" colorful>排队中，请稍后</OMessage>
    </div>

    <div>
      <OMessage status="info" closable colorful>用于表示普通操作信息提示（提示常驻，可手动关闭）</OMessage>
      <OMessage status="success" :duration="3000" colorful>用于表示操作顺利达成（提示3秒后消失）</OMessage>
      <OMessage status="warning" :duration="5000" colorful>用于表示操作引起一定后果（提示5秒后消失）</OMessage>
      <OMessage status="danger" :duration="8000" colorful>用于表示操作引起严重的后果（提示8秒后消失）</OMessage>
      <OMessage status="loading" :duration="10000" colorful>排队中，请稍后（提示10秒后消失）</OMessage>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.o-message + .o-message {
  margin-top: 16px;
}
</style>
