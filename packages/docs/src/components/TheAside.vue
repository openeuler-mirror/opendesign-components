<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';
import { useSidebarStore } from '@/stores/sidebar';
const router = useRouter();
const route = useRoute();

type NavItem = {
  path: string;
  name: string;
  label: string;
};
const sidebarStore = useSidebarStore();

const navClick = (item: NavItem) => {
  router.push(item.path);
};
</script>
<template>
  <aside class="the-aside">
    <div class="nav-list">
      <div v-for="item in sidebarStore.navList" :key="item.path" class="nav-item" :class="{ active: route.name === item.name }" @click="navClick(item)">
        {{ item.label }}
      </div>
    </div>
  </aside>
</template>
<style lang="scss" scoped>
.the-aside {
  background-color: var(--o-color-fill2);
  color: var(--o-color-info1);
  overflow: auto;
  height: calc(100vh - 48px);
}
.nav-item {
  padding: 8px 16px;
  cursor: pointer;
  &:hover {
    color: var(--o-color-info1-inverse);
    background-color: var(--o-color-primary1-light);
  }
  &.active {
    color: var(--o-color-info1-inverse);
    background-color: var(--o-color-primary1);
  }
}
</style>
