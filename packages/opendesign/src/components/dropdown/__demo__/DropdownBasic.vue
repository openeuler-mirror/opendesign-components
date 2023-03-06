<script setup lang="ts">
import { ODropdown, ODropdownItem } from '../index';

import '../../button/style';
import { OButton } from '../../button';

const options = [
  { label: '操作一', value: 'opt1' },
  { label: '操作二', value: 'opt2' },
  { label: '操作三', value: 'opt3' },
  { label: '操作四', value: 'opt4' },
];
</script>

<template>
  <h4>基础用法</h4>
  <section>
    <ODropdown>
      <OButton>Click Me</OButton>
      <template #dropdown>
        <ODropdownItem v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </template>
    </ODropdown>
  </section>
</template>
