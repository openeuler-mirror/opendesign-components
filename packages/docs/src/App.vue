<script setup lang="ts">
import { watchEffect, useTemplateRef, onMounted, shallowReactive, nextTick, ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import TheHeader from './components/TheHeader.vue';
import TheAside from './components/TheAside.vue';
import { changeLocale, locales, LOCALE_COOKIE_KEY } from './lang';
import { useSidebarStore } from './stores/sidebar';
import TheAnchor from './components/TheAnchor';
import { getHeads } from './utils/getHeads';
import { useScreen } from './utils/useScreen';
import { useThemeStore, normalizeSkin, normalizeColor, QUERY_COLOR, QUERY_SKIN, DEFAULT_COLOR, DEFAULT_SKIN_VALUE } from '@/stores/theme';
import DocConfigProvide from './components/DocConfigProvide.vue';

const route = useRoute();
const router = useRouter();
const sidebarStore = useSidebarStore();
const { lePad, isPadV, lePadV } = useScreen();
const themeStore = useThemeStore();
const { setSkin, setColor } = themeStore;
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

// 处理锚点
const appBodyDom = useTemplateRef('appBodyDom');
const heads = shallowReactive<Array<{ title: string; level: number; id: string }>>([]);
onMounted(() => {
  heads.push(...getHeads(appBodyDom.value!));
});
router.afterEach(async (to, from) => {
  // 路由更新后更新锚点
  if (to.fullPath === from.fullPath) {
    return;
  }
  await nextTick();
  heads.length = 0;
  heads.push(...getHeads(appBodyDom.value!));
});
const asideStaticWidth = computed(() => {
  if (isPadV.value) {
    return 'var(--grid-4)';
  }
  if (lePad.value) {
    return 'var(--grid-2)';
  }
  return 'var(--grid-3)';
});
const hideAside = ref(false);
const appAsideWidth = computed(() => {
  if (!sidebarStore.hasData || hideAside.value) {
    return '0px';
  }
  return asideStaticWidth.value;
});
const appAnchorWidth = computed(() => {
  if (heads.length > 0) {
    return asideStaticWidth.value;
  }
  return '0px';
});
const handleAsideClick = () => {
  hideAside.value = !hideAside.value;
};
watchEffect(() => {
  hideAside.value = lePadV.value;
});

// 处理主题
// 不能通过 router 拿到 query，此时 router 还未就绪
const url = new URL(location.href);
setSkin(normalizeSkin(url.searchParams.get(QUERY_SKIN)));
setColor(normalizeColor(url.searchParams.get(QUERY_COLOR)));
router.beforeEach((to) => {
  // 将颜色和皮肤参数写入query
  let hasQuery = false;
  const query: Record<string, string> = {};
  if (themeStore.color !== DEFAULT_COLOR) {
    query[QUERY_COLOR] = themeStore.color;
    hasQuery = true;
  }
  if (themeStore.skinValue !== DEFAULT_SKIN_VALUE) {
    query[QUERY_SKIN] = themeStore.skinValue;
    hasQuery = true;
  }
  if (hasQuery && (to.query[QUERY_COLOR] !== query[QUERY_COLOR] || to.query[QUERY_SKIN] !== query[QUERY_SKIN])) {
    return {
      ...to,
      query: {
        ...to.query,
        ...query,
      },
    };
  }
});
</script>

<template>
  <DocConfigProvide :skin="themeStore.skinValue">
    <div
      class="app-wrapper"
      :class="{ 'hide-sidebar': hideAside }"
      :style="{ '--app-aside-width': appAsideWidth, '--app-aside-static-width': asideStaticWidth, '--app-anchor-width': appAnchorWidth }"
    >
      <TheHeader class="app-header" />
      <TheAside v-if="sidebarStore.hasData" class="app-aside" @click-sidebar="handleAsideClick" />
      <TheAnchor v-if="heads.length" :heads="heads" :target-offset="60" class="app-anchor" />
      <div ref="appBodyDom" class="app-body">
        <router-view />
      </div>
    </div>
  </DocConfigProvide>
</template>

<style lang="scss">
.app-wrapper {
  --app-header-height: 48px;
  --app-header-margin: var(--o3-gap-4);
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
  height: calc(100vh - var(--app-header-height));
  bottom: 0;
  width: calc(50vw - var(--layout-content-width) / 2 + var(--app-aside-static-width));
  z-index: 9;
  transition: transform var(--o-duration-m1) var(--o-easing-standard-in);
}
.hide-sidebar {
  .app-aside {
    transform: translateX(-100%);
  }
}
.app-anchor {
  position: fixed;
  left: calc(50vw + var(--layout-content-width) / 2 - var(--app-anchor-width));
  top: calc(var(--app-header-height) + var(--app-header-margin));
  max-height: calc(100vh - var(--app-header-height) - var(--app-header-margin));
  width: var(--app-anchor-width);
  z-index: 8;
  .o-anchor-line {
    flex-shrink: 0;
  }
  @include respond-to('<=pad_v') {
    display: none;
  }
}
.app-body {
  margin-top: calc(var(--app-header-height) + var(--app-header-margin));
  min-height: calc(100vh - var(--app-header-height));
  background-color: var(--o-color-fill1);
  width: var(--layout-content-width);
  margin-left: auto;
  margin-right: auto;
  @include respond-to('>pad_v') {
    margin-left: calc(50vw - var(--layout-content-width) / 2 + var(--app-aside-width));
    margin-right: 0;
    width: calc(var(--layout-content-width) - var(--app-aside-width) - var(--app-anchor-width));
  }
}
</style>
