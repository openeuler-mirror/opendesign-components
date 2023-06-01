<script setup lang="ts">
import { OTag } from '@components/index';
</script>

<template>
  <h3>运营标签</h3>
  <section>
    <OTag color="primary">NEW</OTag>
    <OTag color="primary">HOT</OTag>
    <OTag color="primary">推荐</OTag>
    <OTag color="primary" class="tag-ascend">优质模型</OTag>
  </section>

  <h3>信息标签</h3>
  <section>
    <OTag>Python</OTag>
    <OTag>C++</OTag>
    <OTag class="tag-normal-inverse">Python</OTag>
  </section>

  <h3>状态标签</h3>
  <section>
    <OTag color="success">已完成</OTag>
    <OTag class="tag-unstart">未开始</OTag>
    <OTag color="danger">未通过</OTag>
  </section>
</template>
<style lang="scss"></style>
