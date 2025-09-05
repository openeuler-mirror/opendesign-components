<script setup lang="ts">
import { h, ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useSidebarStore, type NavItem } from '@/stores/sidebar';
import { OMenu, OSubMenu, OMenuItem } from '@opensig/opendesign';
const router = useRouter();
const route = useRoute();

const sidebarStore = useSidebarStore();

const emits = defineEmits<{
  (e: 'clickSidebar'): void;
}>();

const RecursiveMenu = (props: NavItem) => {
  if (props.children?.length) {
    return h(OSubMenu, { value: props.value }, { default: () => props.children!.map((item) => h(RecursiveMenu, item)), title: () => props.label });
  }
  return h(OMenuItem, { value: props.value }, { default: () => props.label });
};
const path = ref('');
const expand = ref<string[]>([]);
watch(
  () => route.path,
  (newPath) => {
    path.value = newPath;
    if (typeof route.meta.kind === 'string') {
      expand.value = [route.meta.kind];
    }
  },
  { immediate: true },
);
watch(path, (newPath) => {
  router.push(newPath);
});
</script>
<template>
  <aside class="the-aside">
    <OMenu v-model="path" v-model:expanded="expand" size="small" class="nav-list">
      <RecursiveMenu v-for="item in sidebarStore.navList" :key="item.value" v-bind="item" />
    </OMenu>
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
  margin-left: auto;
  --menu-width: auto;
  @include respond-to('>pc') {
    --menu-width: var(--app-aside-static-width);
  }
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
