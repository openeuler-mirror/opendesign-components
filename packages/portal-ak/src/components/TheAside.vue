<script setup lang="ts">
import { routes } from '@/router';
import { ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { OScroller } from '@opendesign-src/index';

const router = useRouter();
const route = useRoute();

const title = '组件';
const currentNav = ref('');

watch(
  () => route.name,
  (val) => {
    currentNav.value = val as string;
  },
  {
    immediate: true,
  }
);
const component = routes.find((item) => item.name == 'component');
const navList = component?.children?.map((item) => {
  const { path, name, label } = item;
  return {
    path,
    name,
    label,
  };
});
const navClick = (item: any) => {
  console.log(item.path);
  router.push(`${component?.path}/${item.path}`);
};
</script>
<template>
  <aside class="the-aside">
    <OScroller class="the-aside-scroller">
      <div class="aside-title">
        {{ title }}
      </div>
      <div class="nav-list">
        <div v-for="item in navList" :key="item.path" class="nav-item" :class="{ active: currentNav === item.name }" @click="navClick(item)">
          {{ item.label }}
        </div>
      </div>
    </OScroller>
  </aside>
</template>
<style lang="scss" scoped>
.the-aside {
  background-color: var(--o-color-fill2);
  color: var(--o-color-info1);
}
.the-aside-scroller {
  height: calc(100vh - 48px);
}
.aside-title {
  padding: 16px;
  text-align: center;
  border-bottom: 1px solid var(--o-color-control1-light);
  font-size: var(--o-font_size-h1);
}
.nav-item {
  padding: 8px 16px;
  cursor: pointer;
  &:hover {
    background-color: var(--o-color-primary1-light);
  }
  &.active {
    color: var(--o-color-info1-inverse);
    background-color: var(--o-color-primary1);
  }
}
</style>
