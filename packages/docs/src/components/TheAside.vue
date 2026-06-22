<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useSidebarStore, type NavItem } from '@/stores/sidebar';
import { OMenu, vScrollbar, OInput, debounce } from '@opensig/opendesign';
import RecursiveMenu from './RecursiveMenu';
const router = useRouter();
const route = useRoute();

const sidebarStore = useSidebarStore();

const emits = defineEmits<{
  (e: 'clickSidebar'): void;
}>();

const path = ref('');
const expand = ref<string[]>([]);
const searchKey = ref('');

/** 搜索递归结果的返回类型 */
type SearchResult = { filtered: NavItem[]; expands: string[] };

/**
 * 为导航项标签拼接子项数量后缀，仅在子项数量大于 0 时拼接
 * @param label - 原始标签文本
 * @param count - 子项数量
 * @returns 拼接后的标签文本
 */
const formatLabel = (label: string, count?: number): string => (count && count > 0 ? `${label}(${count})` : label);

/**
 * 格式化导航列表，为有子项的节点拼接数量后缀
 * @param list - 原始导航列表
 * @returns 格式化后的导航列表
 */
const formatData = (list: Array<NavItem>): NavItem[] =>
  list.map((item) => ({
    ...item,
    label: formatLabel(item.label, item.children?.length),
  }));

/**
 * 递归搜索导航列表，返回过滤后的导航项及需要展开的父级 value 集合
 * @param navList - 原始导航列表
 * @param key - 搜索关键词（已转为小写）
 * @param ancestors - 当前递归路径上所有父级的 value（用于收集需要展开的节点）
 * @returns filtered 过滤后的导航项和 expands 需要展开的父级 value 集合
 */
const recursiveSearch = (navList: NavItem[], key: string, ancestors: string[] = []): SearchResult => {
  const filtered: NavItem[] = [];
  const expands: string[] = [];

  for (const item of navList) {
    if (item.children?.length) {
      // 子菜单：递归搜索子级，传入当前项的 value 作为祖先
      const childResult = recursiveSearch(item.children, key, [...ancestors, item.value]);
      if (childResult.filtered.length > 0) {
        filtered.push({
          ...item,
          label: formatLabel(item.label, childResult.filtered.length),
          children: childResult.filtered,
        });
        // 当前子菜单及所有祖先都需要展开，子级递归收集的展开值也需要包含
        expands.push(item.value, ...ancestors, ...childResult.expands);
      }
    } else if (item.label.toLowerCase().includes(key)) {
      // 叶子节点匹配：收集所有祖先的 value 用于自动展开
      filtered.push(item);
      expands.push(...ancestors);
    }
  }

  return { filtered, expands };
};

/** 当前导航列表的格式化快照，跟随 sidebarStore.navList 响应式更新 */
const defaultNavList = computed(() => formatData(sidebarStore.navList));
const displayNavList = ref(defaultNavList.value);

/**
 * 根据搜索关键词更新导航列表和展开状态
 * @param key - 搜索关键词，为空时恢复默认列表
 */
const applySearch = (key: string) => {
  if (!key) {
    displayNavList.value = defaultNavList.value;
    // 清空搜索时恢复到路由对应的展开状态
    expand.value = typeof route.meta.kind === 'string' ? [route.meta.kind] : [];
  } else {
    const { filtered, expands } = recursiveSearch(sidebarStore.navList, key.toLowerCase());
    displayNavList.value = filtered;
    // 搜索匹配时，自动递归展开所有匹配项的父级菜单（去重）
    expand.value = [...new Set(expands)];
  }
};

/** 用户键盘输入搜索时使用 debounce，避免高频触发递归搜索 */
const searchNavByKey = debounce(applySearch);

watch(
  () => route.path,
  (newPath) => {
    path.value = newPath;
    if (typeof route.meta.kind === 'string') {
      expand.value = [route.meta.kind];
    }
    // 跳转到其他组件时，立即清除搜索条件并恢复导航列表（不走 debounce）
    if (searchKey.value) {
      searchKey.value = '';
      applySearch('');
    }
  },
  { immediate: true },
);
watch(path, (newPath) => {
  router.push(newPath);
});

watch(searchKey, (v) => {
  searchNavByKey(v);
});

watch(
  () => sidebarStore.navList,
  () => {
    // navList 更新时，若正在搜索则重新执行搜索；否则恢复默认列表
    if (searchKey.value) {
      const { filtered } = recursiveSearch(sidebarStore.navList, searchKey.value.toLowerCase());
      displayNavList.value = filtered;
    } else {
      displayNavList.value = defaultNavList.value;
    }
  },
);
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
