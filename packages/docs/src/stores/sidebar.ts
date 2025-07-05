import { defineStore } from 'pinia';
import { computed, ref, watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import { sidebarRouteConfig, type SidebarNameT } from '@/router';
import { useI18n } from '@opensig/opendesign';
type MetaT = { sidebar: string; lang: string };

export const useSidebarStore = defineStore('sidebar', () => {
  const nameOptions = Object.keys(sidebarRouteConfig) as SidebarNameT[];
  const sidebarName = ref<SidebarNameT | ''>('');
  const { locale } = useI18n();
  const route = useRoute();
  watchEffect(() => {
    if (!route.name || typeof route.name !== 'string') {
      return;
    }
    const cleanName = route.name.split('/')[0] as SidebarNameT;
    if (nameOptions.includes(cleanName)) {
      sidebarName.value = cleanName;
    } else {
      sidebarName.value = '';
    }
  });
  const navList = computed(() => {
    if (!sidebarName.value) {
      return [];
    }
    const routes = sidebarRouteConfig[sidebarName.value].routes;
    return routes
      .filter((item) => (item.meta as MetaT).lang === locale.value)
      .map((item) => ({
        path: item.path,
        name: item.name as string,
        label: (item.meta as MetaT).sidebar,
      }));
  });
  const isShowSidebar = computed(() => sidebarName.value && navList.value.length);
  return {
    sidebarName,
    navList,
    isShowSidebar,
  };
});
