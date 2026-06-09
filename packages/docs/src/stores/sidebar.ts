import { defineStore } from 'pinia';
import { computed, ref, watch, type Ref } from 'vue';
import { useRouter, type Router } from 'vue-router';
import { sidebarRouteConfig, type SidebarNameT } from '@/router';
import { useI18n } from '@opensig/opendesign';
export type NavItem = {
  value: string;
  label: string;
  children?: NavItem[];
};
/** 从NavItem数组中找到一个最深的且最近的节点，该节点就是菜单中第一个可跳转的节点 */
const getDeepestNearestNavItem = (navList: NavItem[]): NavItem | null => {
  for (const item of navList) {
    if (item.children?.length) {
      const deepest = getDeepestNearestNavItem(item.children);
      if (deepest) {
        return deepest;
      }
    } else {
      return item;
    }
  }
  return null;
};
/** 是否有名为sidebarName的侧边栏 */
const hasTheSidebar = (sidebarName: string): sidebarName is SidebarNameT => {
  return Object.prototype.hasOwnProperty.call(sidebarRouteConfig, sidebarName);
};
/** 对 NavItem 进行深度排序 */
const deepSort = (children: NavItem[]) => {
  children.sort((a, b) => a.label.localeCompare(b.label));
  children.forEach((child) => child.children && deepSort(child.children));
};
/** 对 NavItem 进行深度排序：第一层按照 firstLevelOrder 排序，其余深度按照标题字符串排序 */
const sortNavItem = (navList: NavItem[], firstLevelOrder: string[] = []) => {
  const firstLevelOrderMap = firstLevelOrder.reduce(
    (acc, cur, index) => {
      acc[cur] = index;
      return acc;
    },
    {} as Record<string, number>,
  );
  navList.sort((a, b) => {
    const aOrder = firstLevelOrderMap[a.value] ?? 0;
    const bOrder = firstLevelOrderMap[b.value] ?? 0;
    return aOrder - bOrder;
  });
  navList.forEach((item) => item.children && deepSort(item.children));
  return navList;
};
const getNavList = (sidebarName: string, lang: string, t: (key: string) => string) => {
  if (!sidebarName || !hasTheSidebar(sidebarName)) {
    return [];
  }
  const { routes, subMenuOrder } = sidebarRouteConfig[sidebarName];
  const _navList: NavItem[] = [];
  const navItemRecord: Record<string, NavItem> = {};
  for (const item of routes) {
    const meta = item.meta;
    if (meta.lang === lang) {
      const kind = meta.kind;
      let subMenu = navItemRecord[kind];
      if (!subMenu) {
        subMenu = { value: kind, label: t(`menu.${kind}`), children: [] };
        navItemRecord[kind] = subMenu;
        _navList.push(subMenu);
      }
      subMenu.children?.push({
        value: item.path,
        label: meta.sidebar,
      });
    }
  }
  sortNavItem(_navList, subMenuOrder);
  return _navList;
};
const normalizeSidebarName = (sidebarName: any) => {
  if (typeof sidebarName === 'string' && hasTheSidebar(sidebarName)) {
    return sidebarName;
  }
  return '';
};

interface NavigateToSidebarContext {
  /** 新的侧边栏名称 */
  newName: SidebarNameT | '';
  /** 侧边栏名称 ref */
  nameRef: Ref<SidebarNameT | ''>;
  /** 路由实例 */
  router: Router;
  /** 基于新名称重新计算导航列表 */
  getNewNavList: () => NavItem[];
}

/**
 * 切换侧边栏并导航到最近的菜单项
 * @param newName - 新的侧边栏名称
 * @param nameRef - 侧边栏名称 ref
 * @param router - 路由实例
 * @param getNewNavList - 基于新名称重新计算导航列表的函数
 */
function navigateToSidebar({ newName, nameRef, router, getNewNavList }: NavigateToSidebarContext): void {
  if (!hasTheSidebar(newName)) {
    nameRef.value = '';
    return;
  }
  nameRef.value = newName;
  const navList = getNewNavList();
  const dfNavItem = getDeepestNearestNavItem(navList);
  if (dfNavItem) {
    router.push(dfNavItem.value);
  }
}

export const useSidebarStore = defineStore('sidebar', () => {
  const router = useRouter();
  const { locale, t } = useI18n();
  const sidebarName = ref<SidebarNameT | ''>('');
  watch(
    () => router.currentRoute.value.meta.sidebarName,
    (newVal) => {
      sidebarName.value = normalizeSidebarName(newVal);
    },
    { immediate: true },
  );
  const navList = computed(() => getNavList(sidebarName.value, locale.value, t));
  const hasData = computed(() => sidebarName.value && navList.value.length);
  const changeSidebar = (_sidebarName: SidebarNameT | '') => {
    navigateToSidebar({ newName: _sidebarName, nameRef: sidebarName, router, getNewNavList: () => getNavList(_sidebarName, locale.value, t) });
  };
  return {
    sidebarName: computed(() => sidebarName.value),
    navList,
    hasData,
    changeSidebar,
  };
});
