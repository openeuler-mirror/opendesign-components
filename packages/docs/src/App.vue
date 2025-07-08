<script setup lang="ts">
import { watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import TheHeader from './components/TheHeader.vue';
import TheAside from './components/TheAside.vue';
import { changeLocale, locales, LOCALE_COOKIE_KEY } from './lang';
import { useSidebarStore } from './stores/sidebar';

const route = useRoute();
const sidebarStore = useSidebarStore();
watchEffect(() => {
  const routeLocale = locales.find((item) => item.value === route.meta.lang);
  if (routeLocale) {
    changeLocale(routeLocale.value);
  } else {
    const cookies = document.cookie.split(';').reduce(
      (acc, cur) => {
        const [key, value] = cur.split('=');
        acc[key.trim()] = value;
        return acc;
      },
      {} as Record<string, string>,
    );
    const cookieLocale = locales.find((item) => item.value === cookies[LOCALE_COOKIE_KEY]);
    if (cookieLocale) {
      changeLocale(cookieLocale.value);
    } else {
      changeLocale('zh-CN');
    }
  }
});
</script>

<template>
  <TheHeader class="app-header" />
  <TheAside v-if="sidebarStore.isShowSidebar" class="app-aside" />
  <div class="app-body" :class="{ 'has-sidebar': sidebarStore.isShowSidebar }">
    <router-view />
  </div>
</template>

<style lang="scss">
body {
  --app-header-height: 48px;
  --app-aside-width: 240px;
  font-family: 'Helvetica', 'Arial', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  @media (max-width: 840px) {
    --app-aside-width: 0;
  }
}
.app-header {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  box-sizing: border-box;
  height: var(--app-header-height);
  z-index: 10;
}
.app-aside {
  position: fixed;
  top: var(--app-header-height);
  left: 0;
  bottom: 0;
  width: var(--app-aside-width);
  z-index: 9;
  @media (max-width: 840px) {
    display: none;
  }
}
.app-body {
  margin-top: var(--app-header-height);
  min-height: calc(100vh - 48px);
  background-color: var(--o-color-fill1);

  &.has-sidebar {
    margin-left: var(--app-aside-width);
  }
}
</style>
