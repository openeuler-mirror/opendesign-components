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
const emits = defineEmits<{
  (e: 'clickSidebar'): void;
}>();
</script>
<template>
  <aside class="the-aside">
    <div class="nav-list">
      <div v-for="item in sidebarStore.navList" :key="item.path" class="nav-item" :class="{ active: route.name === item.name }" @click="navClick(item)">
        {{ item.label }}
      </div>
    </div>
    <div class="controller" @click="emits('clickSidebar')">
      <div class="vertical-line"></div>
    </div>
  </aside>
</template>
<style lang="scss" scoped>
.the-aside {
  background-color: var(--o-color-fill2);
  color: var(--o-color-info1);
  border-right: 1px solid var(--o-color-control1-light);
}
.nav-list {
  width: var(--app-aside-static-width);
  margin-left: auto;
}
.nav-item {
  padding: var(--o3-gap-2) var(--o3-gap-4);
  cursor: pointer;
  &:hover {
    color: var(--o-color-info1);
    background-color: var(--o-color-control2-light);
  }
  &.active {
    color: var(--o-color-info1);
    background-color: var(--o-color-control3-light);
  }
}
.controller {
  position: absolute;
  top: 50%;
  left: 100%;
  transform: translateY(-50%);
  padding: var(--o-gap-4) 4px var(--o-gap-4) 2px;
  border: 1px solid var(--o-color-control1-light);
  border-left: none;
  border-radius: 0 4px 4px 0;
  background-color: var(--o-color-fill2);
  cursor: pointer;
}
.vertical-line {
  width: 2px;
  height: 24px;
  background-color: var(--o-color-control3);
}
</style>
