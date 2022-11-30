<script setup lang="ts">
import {routes} from '@/router';
import { useRouter } from 'vue-router';
const router = useRouter();

const title = 'aside';

const navList = routes.map(item=>{
  const {path, label}=item;
  return {
    path,
    label,
  };
});

const navClick = (item: typeof navList[0])=>{
  console.log(item.path);
  router.push(item.path);
};
</script>
<template>
  <div class="the-aside">
    <div class="aside-title">
      {{ title }}
    </div>
    <div class="nav-list">
      <div v-for="(item) in navList" :key="item.path" class="nav-item" @click="navClick(item)">
        {{ item.label }}
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.the-aside {
  background-color: #f6f6f6;
  color: #333;
}
.aside-title {
  padding: 8px;
  text-align: center;
}
.nav-item {
  padding: 4px 16px;
  cursor: pointer;
  &:hover {
    background-color: #eee;
  }
}
</style>