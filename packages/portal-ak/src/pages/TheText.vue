<script setup lang="ts">
import '@components/style';
const list = ['display1', 'display2', 'display3', 'h1', 'h2', 'h3', 'h4', 'text1', 'text2', 'tip1', 'tip2'];
const letter = 'abcdefghijklmnopqrstuvwxyz';
const letterUp = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const number = '0123456789';
</script>
<template>
  <div class="page-demo">
    <div v-for="t in list" :key="t" :class="[`o-txt-${t}`]">
      <div class="row">
        <div class="name">[{{ t }}]</div>
        <div>
          <div>{{ number }}</div>
          <div>{{ letter }}</div>
          <div>{{ letterUp }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
.name {
  font-size: 18px;
  line-height: 24px;
  margin: 16px 0 4px;
}
</style>
