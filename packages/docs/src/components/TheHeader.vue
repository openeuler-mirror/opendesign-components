<script setup lang="ts">
import { computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ODropdown, ODropdownItem, useI18n, useTheme } from '@opensig/opendesign';
import { useHighLightTheme } from '@/utils/useHighLightTheme';
import { currentLocale, changeLocale, locales } from '@/lang';
import { sidebarRouteConfig, type SidebarNameT } from '@/router';
import { useSidebarStore } from '@/stores/sidebar';

const sidebarStore = useSidebarStore();
const themeInfo = [
  {
    key: 'light',
    name: '[light]opendesign',
  },
  {
    key: 'dark',
    name: '[dark]opendesign',
  },
  {
    key: 'a.light',
    name: '[light]A',
  },
  {
    key: 'a.dark',
    name: '[dark]A',
  },
  {
    key: 'k.light',
    name: '[light]K',
  },
  {
    key: 'k.dark',
    name: '[dark]K',
  },
];

const { theme } = useTheme();
const router = useRouter();
const route = useRoute();
// 根据light/dark切换代码块样式表
useHighLightTheme(theme);
if (!theme.value) {
  theme.value = themeInfo[0].key;
}

const themeName = computed(() => {
  const themeItem = themeInfo.find((item) => item.key === theme.value);
  return themeItem ? themeItem.name : '--';
});

const changeTheme = (key: string) => {
  theme.value = key;
};

const { t, locale } = useI18n();

const sidebarRouteOptions = Object.entries(sidebarRouteConfig).map(([key, value]) => ({ value: key as SidebarNameT, label: value.label }));

const changeSidebar = (name: SidebarNameT) => {
  sidebarStore.sidebarName = name;
  router.push(sidebarStore.navList[0] || '/');
};
watch(locale, (newLocale, oldLocale) => {
  if (sidebarStore.sidebarName === 'component') {
    try {
      const newPath = router.resolve(route.path.replace(new RegExp(`^/${oldLocale}/`), `/${newLocale}/`));
      router.push(newPath);
    } catch {
      router.push('/');
    }
  }
});
</script>
<template>
  <div class="the-header">
    <span class="theme-name">{{ themeName }}</span>
    <div class="left" @click="router.push('/')">
      {{ t('header.home') }}
    </div>
    <div class="right">
      <div class="nav">
        <div
          v-for="item in sidebarRouteOptions"
          :key="item.value"
          class="nav-item"
          :class="{ active: sidebarStore.sidebarName === item.value }"
          @click="changeSidebar(item.value)"
        >
          {{ item.label() }}
        </div>
      </div>
      <div class="tools">
        <div class="tool-item">
          <ODropdown>
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="theme-icon">
              <path
                fill="currentColor"
                d="M7.012 8.591l-2.005 1.999c-0.091 0.097-0.218 0.151-0.351 0.151s-0.26-0.055-0.351-0.151l-2.155-2.099c-0.097-0.091-0.152-0.217-0.152-0.35s0.055-0.259 0.152-0.35l3.719-3.719c0.25-0.25 0.561-0.429 0.902-0.52l2.055-0.55c0.121-0.029 0.244 0.035 0.291 0.15 0.616 1.045 1.697 1.732 2.907 1.849 1.208-0.115 2.288-0.798 2.907-1.839 0.043-0.119 0.167-0.187 0.291-0.16l2.005 0.54c0.341 0.091 0.653 0.27 0.902 0.52l3.719 3.719c0.097 0.091 0.152 0.217 0.152 0.35s-0.055 0.259-0.152 0.35l-2.125 2.119c-0.091 0.097-0.218 0.151-0.351 0.151s-0.26-0.055-0.351-0.151l-2.005-1.999v11.396c0 0.552-0.449 1-1.002 1h-7.999c-0.554 0-1.002-0.448-1.002-1v-11.406z"
              />
            </svg>
            <template #dropdown>
              <ODropdownItem v-for="item in themeInfo" :key="item.name" :label="item.name" :value="item.name" @click="changeTheme(item.key)" />
            </template>
          </ODropdown>
        </div>
        <div class="tool-item">
          <ODropdown>
            {{ currentLocale?.label }}
            <template #dropdown>
              <ODropdownItem v-for="item in locales" :key="item.value" :label="item.label" :value="item.value" @click="changeLocale(item.value)" />
            </template>
          </ODropdown>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.the-header {
  color: var(--o-color-info1);
  display: flex;
  padding: 0 var(--o-gap-7);
  font-size: var(--o-font_size-h3);
  line-height: var(--o-line_height-h3);
  background-color: rgba(var(--o-mixedgray-1), 0.9);
  box-shadow: var(--o-shadow-1);
  backdrop-filter: blur(5px);
}
.theme-name {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate3d(-50%, -50%, 0);
}
.left {
  display: flex;
  align-items: center;
  cursor: pointer;
}
.right {
  margin-left: auto;
  display: flex;
}
.nav {
  display: flex;
  align-self: stretch;
}
.nav-item {
  margin-right: var(--o-gap-5);
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
  &.active {
    &::after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 2px;
      background-color: var(--o-color-primary1);
    }
  }
}
.nav,
.tools {
  font-size: var(--o-font_size-text2);
  line-height: var(--o-line_height-text2);
}
.tools {
  display: flex;
  align-items: center;
  color: var(--o-color-info1);

  .tool-item {
    cursor: pointer;
    & + .tool-item {
      margin-left: var(--o-gap-5);
    }
  }
}
.theme-icon {
  display: block;
}
</style>
