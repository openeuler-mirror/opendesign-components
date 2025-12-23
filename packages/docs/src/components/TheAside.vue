<script setup lang="ts">
import { h, ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useSidebarStore, type NavItem } from '@/stores/sidebar';
import { OMenu, OSubMenu, OMenuItem, vScrollbar, OInput, debounce } from '@opensig/opendesign';
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

const searchKey = ref('');

const defaultNavList= sidebarStore.navList.map(item=>({
  ...item,
  label: `${item.label}(${item.children?.length || 0})`,
}))

const displayNavList = ref(defaultNavList);
const searchNavByKey = debounce((key: string) => {
  if (!key) {
    displayNavList.value = defaultNavList;
  } else {
    displayNavList.value = [];
    sidebarStore.navList.forEach(item => {
      const res = item.children?.filter(t => {
        return t.label.toLocaleLowerCase().includes(key.toLocaleLowerCase())
      })
      if (res?.length && res?.length > 0) {
        displayNavList.value.push({
          ...item,
          label: `${item.label}(${res.length})`,
          children: res
        })
      }
    });
  }
});
watch(searchKey, (v) => {
  searchNavByKey(v);
});
</script>
<template>
  <aside class="the-aside">
    <div class="search">
      <OInput v-model="searchKey" class="search-input" placeholder="搜索组件..." clearable />
    </div>
    <OMenu v-model="path" v-model:expanded="expand" v-scrollbar size="small" class="nav-list">
      <RecursiveMenu v-for="item in displayNavList" :key="item.value" v-bind="item" />
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
  padding: 0 8px;
  padding-bottom: 64px;
}

.search {
  margin: 12px;
}

.search-input {
  width: 100%;
}

.nav-list {
  margin-left: auto;
  --menu-width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  max-height: 100%;
  // 防止滚动穿透到 body 元素上
  overscroll-behavior: contain;

  @include respond-to('>pc') {
    // --menu-width: var(--app-aside-static-width);
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
