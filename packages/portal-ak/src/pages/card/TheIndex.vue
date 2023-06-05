<script setup lang="ts">
import { computed } from 'vue';
import theme from '../../shared/theme';

import CardTextA from './a/CardText-A.vue';
import CardIconA from './a/CardIcon-A.vue';
import CardCoverAndTextA from './a/CardCoverAndText-A.vue';

import CardTextK from './k/CardText-K.vue';
import CardIconK from './k/CardIcon-K.vue';
import CardCoverAndTextK from './k/CardCoverAndText-K.vue';

const prefix = computed(() => theme.value.split('.')[0]);
</script>

<template>
  <div v-if="prefix === 'a'" class="page-demo">
    <CardTextA />
    <CardIconA />
    <CardCoverAndTextA />
  </div>
  <div v-if="prefix === 'k'" class="page-demo">
    <CardTextK />
    <CardIconK />
    <CardCoverAndTextK />
  </div>
</template>
