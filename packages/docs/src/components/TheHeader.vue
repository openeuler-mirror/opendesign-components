<script setup lang="ts">
import { computed, watch, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ODropdown, ODropdownItem, useI18n, OSwitch } from '@opensig/opendesign';
import { currentLocale, changeLocale, locales } from '@/lang';
import { sidebarRouteConfig, type SidebarNameT } from '@/router';
import { useSidebarStore } from '@/stores/sidebar';
import { DocIconDark, DocIconLight } from '@/icon-components';
import { theme } from '@/utils/theme';

const sidebarStore = useSidebarStore();
const themes = [
  {
    key: '',
    name: 'Euler',
  },
  {
    key: 'a.',
    name: 'Ascend',
  },
  {
    key: 'k.',
    name: 'Kunpeng',
  },
] as const;
type ThemeT = (typeof themes)[number];
const colorSwitcher = {
  checked: 'dark',
  unchecked: 'light',
};
const themesValue = ref<ThemeT>(themes[0]);
const colorSwitcherValue = ref(colorSwitcher.unchecked);
const router = useRouter();
const route = useRoute();
watch(
  [themesValue, colorSwitcherValue],
  ([newTheme, newColorSwitcher]) => {
    theme.value = `${newTheme.key}${newColorSwitcher}`;
  },
  { immediate: true },
);

const themeName = computed(() => {
  return `${themesValue.value.name}-${colorSwitcherValue.value}`;
});

const changeTheme = (item: (typeof themes)[number]) => {
  themesValue.value = item;
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
            {{ t('header.theme') }}
            <template #dropdown>
              <ODropdownItem v-for="item in themes" :key="item.name" :label="item.name" :value="item.name" @click="changeTheme(item)" />
            </template>
          </ODropdown>
        </div>
        <div class="tool-item">
          <OSwitch v-model="colorSwitcherValue" :checked-value="colorSwitcher.checked" :unchecked-value="colorSwitcher.unchecked">
            <template #off><DocIconLight /></template>
            <template #on><DocIconDark /></template>
          </OSwitch>
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
  padding: 0 calc((100vw - var(--grid-full)) / 2);
  font-size: var(--o3-font_size-h3);
  line-height: var(--o3-line_height-h3);
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
  margin-right: var(--o3-gap-5);
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
  font-size: var(--o3-font_size-text2);
  line-height: var(--o3-line_height-text2);
}
.tools {
  display: flex;
  align-items: center;
  color: var(--o-color-info1);

  .tool-item {
    cursor: pointer;
    & + .tool-item {
      margin-left: var(--o3-gap-5);
    }
  }
}
.theme-icon {
  display: block;
}
</style>
