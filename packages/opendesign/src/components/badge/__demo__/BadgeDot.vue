<script setup lang="ts">
import { OButton } from '../../button';
import '../../button/style';
import { OLink } from '../../link';
import '../../link/style';
import { OBadge } from '../index';

const link = 'www.openeuler.org';
</script>

<template>
  <h4>点状徽章</h4>
  <section>
    <OBadge color="danger" dot>
      <OButton variant="solid" />
    </OBadge>
    <OBadge color="danger" dot>
      <OLink :href="link">普通链接</OLink>
    </OBadge>
  </section>
</template>
