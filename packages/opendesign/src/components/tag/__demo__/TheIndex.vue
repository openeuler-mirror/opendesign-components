<script setup lang="ts">
import '../style';

import TagBasic from './TagBasic.vue';
import TagColor from './TagColor.vue';
import TagSize from './TagSize.vue';
import TagShape from './TagRound.vue';
import TagOutline from './TagOutline.vue';
import TagClosable from './TagClosable.vue';
</script>

<template>
  <div class="page-demo">
    <TagBasic />
    <TagColor />
    <TagSize />
    <TagShape />
    <TagClosable />
    <TagOutline />
  </div>
</template>
