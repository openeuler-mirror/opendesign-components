<script setup lang="ts">
import { LinkConfigT, OConfigProvider } from '../index';
import { OLink } from '../../link';
import '../../link/style';


const linkConfig: LinkConfigT = {
  click: (e, params, attrs) => {
    console.log(e, params, attrs);
  },
};
</script>
<template>
<h4>配置Link组件</h4>
  <section style="align-items: flex-start">
   <OConfigProvider :link="linkConfig">
      <OLink status="primary" diy="123">OLink</OLink>
    </OConfigProvider>
  </section>
</template>
<style lang="scss"></style>
