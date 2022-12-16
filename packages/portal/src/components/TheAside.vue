<script setup lang="ts">
import { routes } from '@/router';
import { ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
const router = useRouter();
const route = useRoute();

const title = '组件';
const currentNav = ref('Home');

watch(
  () => route.name,
  (val) => {
    currentNav.value = val as string;
  }
);

const navList = routes.map((item) => {
  const { path, name, label } = item;
  return {
    path,
    name,
    label,
  };
});

const navClick = (item: typeof navList[0]) => {
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
      <div
        v-for="item in navList"
        :key="item.path"
        class="nav-item"
        :class="{ active: currentNav === item.name }"
        @click="navClick(item)"
      >
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
  border-bottom: 1px solid #eee;
}
.nav-item {
  padding: 8px 16px;
  cursor: pointer;
  &:hover {
    background-color: #eee;
  }
  &.active {
    background-color: #ddd;
  }
}
</style>
