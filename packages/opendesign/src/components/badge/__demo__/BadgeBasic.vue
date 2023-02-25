<script setup lang="ts">
import { OButton } from '../../button';
import '../../button/style';
import { OBadge } from '../index';
</script>

<template>
  <h4>基础用法</h4>
  <section>
    <OBadge :value="9">
      <OButton variant="solid" />
    </OBadge>
    <OBadge :value="100">
      <OButton variant="solid" />
    </OBadge>
    <OBadge value="hot">
      <OButton variant="solid" />
    </OBadge>
  </section>
</template>
