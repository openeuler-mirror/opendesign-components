<script setup lang="ts">
import { ref } from 'vue';
import { OLink } from '../index';

const link = 'https://www.hiascend.com';

const onLinkClick = (e: MouseEvent) => {
  alert(`浮层${(e.target as HTMLElement).innerHTML}`);
};

const loading = ref(false);
const onLinkClick2 = () => {
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
  }, 3000);
};
</script>
<template>
  <section>
    <p>
      这是一段文本中，掺杂了一些<OLink :href="link">链接</OLink>和<OLink :href="link">禁用的链接</OLink>，可以使用<OLink :href="link" target="_blank">
        新页签打开的链接
      </OLink>
      ，当然也有<OLink :href="link" icon>图标链接</OLink>，这个<OLink :loading="loading" @click="onLinkClick2">链接</OLink>点击有loading效果，这个<OLink
        @click="onLinkClick"
      >
        链接 </OLink
      >点击会弹出弹窗。
    </p>
  </section>
</template>
<style lang="scss"></style>
