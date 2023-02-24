<script setup lang="ts">
import { OButton } from '../../button';
import '../../button/style';
import { OBadge } from '../index';
</script>

<template>
  <h4>单独使用</h4>
  <section>
    <OBadge :value="9" />
    <OBadge :value="100" />
    <OBadge value="hot" />
    <OBadge dot />
  </section>
</template>
