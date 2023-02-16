<script setup lang="ts">
import '../style';

import TagBasic from './TagBasic.vue';
import TagClosable from './TagClosable.vue';
import TagShape from './TagShape.vue';
import TagSize from './TagSize.vue';
import TagStatus from './TagStatus.vue';
import TagBordered from './TagBordered.vue';
import TagCheckable from './TagCheckable.vue';
</script>

<template>
  <div class="page-demo">
    <TagBasic />
    <TagClosable />
    <TagShape />
    <TagSize />
    <TagStatus />
    <TagBordered />
    <TagCheckable />
  </div>
</template>
