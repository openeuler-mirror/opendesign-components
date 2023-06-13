<script setup lang="ts">
import { OTag } from '@components/index';
</script>

<template>
  <h3>运营标签</h3>
  <section>
    <OTag color="primary" round="pill">NEW</OTag>
    <OTag color="primary" round="pill">HOT</OTag>
    <OTag color="primary" round="pill">推荐</OTag>
    <OTag round="pill" class="c-tag-ascend">昇腾标签</OTag>
    <OTag round="pill" class="c-tag-kunpeng">鲲鹏标签</OTag>
  </section>

  <h3>信息标签</h3>
  <section>
    <OTag round="pill">Python</OTag>
    <OTag round="pill">C++</OTag>
    <OTag round="pill" class="c-tag-normal-inverse">Python</OTag>
  </section>

  <h3>状态标签</h3>
  <section>
    <OTag round="pill" color="success">已完成</OTag>
    <OTag round="pill" class="c-tag-unstart">未开始</OTag>
    <OTag round="pill" class="c-tag-processing">处理中</OTag>
    <OTag round="pill" color="danger">未通过</OTag>
  </section>
</template>
<style lang="scss"></style>
