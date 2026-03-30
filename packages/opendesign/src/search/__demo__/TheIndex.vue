<script setup lang="ts">
import '../style';
import SearchBasic from './SearchBasic.vue';
import SearchWithFilter from './SearchWithFilter.vue';
import SearchWithSuggesstions from './SearchWithSuggesstions.vue';
</script>

<template>
  <div class="page-demo">
    <SearchBasic />
    <SearchWithFilter />
    <SearchWithSuggesstions />
  </div>
</template>
