import { computed, ref } from 'vue';
import { useRouter, type Router } from 'vue-router';
import { defineStore } from 'pinia';
import { usePrefetch } from '@/utils/optimize';
// import openDesignSkin from '@opensig/opendesign/theme/opendesign/index.scss?url';
import kunpengSkin from '@opensig/opendesign/theme/kunpeng/index.scss?url';
import ascendSkin from '@opensig/opendesign/theme/ascend/index.scss?url';
import eulerSkin from '@opensig/opendesign/theme/openeuler/index.scss?url';

export const skin = [
  {
    value: 'e',
    name: 'openEuler',
  },
  {
    value: 'g',
    name: 'openGauss',
  },
  {
    value: 'u',
    name: 'openUBMC',
  },
  {
    value: 'm',
    name: 'MindSpore',
  },
  {
    value: 'a',
    name: 'Ascend',
  },
  {
    value: 'k',
    name: 'Kunpeng',
  },
] as const;
export type SkinT = (typeof skin)[number];
const skinMap = new Map(skin.map((item) => [item.value, item.name]));
export const colors = ['light', 'dark'] as const;
const colorSet = new Set(colors);
export type ColorT = (typeof colors)[number];
export const linkConfig: Record<string, string> = {
  k: kunpengSkin,
  a: ascendSkin,
  g: eulerSkin,
  m: eulerSkin,
  u: eulerSkin,
  e: eulerSkin,
};
usePrefetch([
  // { url: openDesignSkin, as: 'style' },
  { url: kunpengSkin, as: 'style' },
  { url: ascendSkin, as: 'style' },
  { url: eulerSkin, as: 'style' },
]);
const LINK_DOM_MARK = '__docs_theme_link_dom__';
export const QUERY_SKIN = '__skin';
export const QUERY_COLOR = '__color';
export const DEFAULT_COLOR = 'light';
export const DEFAULT_SKIN_VALUE = 'e';
export const DEFAULT_SKIN_HREF = eulerSkin;

export const normalizeSkin = (skinValue: any): SkinT['value'] => {
  if (skinMap.has(skinValue)) {
    return skinValue;
  }
  return DEFAULT_SKIN_VALUE;
};
export const normalizeColor = (colorValue: any): ColorT => {
  if (colorSet.has(colorValue)) {
    return colorValue;
  }
  return DEFAULT_COLOR;
};
export const parseTheme = (theme: string) => {
  const sc = theme.split('.');
  let skinValue = '';
  let colorValue = '';
  if (sc.length === 2) {
    skinValue = sc[0];
    colorValue = sc[1];
  } else {
    colorValue = sc[0];
  }
  return {
    skin: normalizeSkin(skinValue),
    color: normalizeColor(colorValue),
  };
};

/**
 * 根据皮肤值获取皮肤名称
 * @param skinValue - 皮肤值
 * @returns 皮肤名称
 */
function resolveSkinName(skinValue: SkinT['value']): string | undefined {
  return skinMap.get(skinValue) ?? skinMap.get(DEFAULT_SKIN_VALUE);
}

/**
 * 根据皮肤值和颜色值拼接主题字符串
 * @param skinValue - 皮肤值
 * @param color - 颜色值
 * @returns 主题字符串（如 "e.light"）
 */
function buildThemeString(skinValue: SkinT['value'], color: ColorT): string {
  return `${skinValue ? `${skinValue}.` : ''}${color}`;
}

/**
 * 更新路由中的皮肤查询参数
 * @param router - 路由实例
 * @param skinValue - 皮肤值
 */
function updateRouteSkinQuery(router: Router, skinValue: SkinT['value']): void {
  const route = router.currentRoute.value;
  if (route.matched.length) {
    router.replace({ ...route, query: { ...route.query, [QUERY_SKIN]: skinValue === DEFAULT_SKIN_VALUE ? undefined : skinValue } });
  }
}

/**
 * 更新路由中的颜色查询参数
 * @param router - 路由实例
 * @param color - 颜色值
 */
function updateRouteColorQuery(router: Router, color: ColorT): void {
  const route = router.currentRoute.value;
  if (route.matched.length) {
    router.replace({ ...route, query: { ...route.query, [QUERY_COLOR]: color === DEFAULT_COLOR ? undefined : color } });
  }
}

interface SkinLoadContext {
  /** 新皮肤值 */
  newVal: SkinT['value'];
  /** 旧皮肤值引用 */
  oldSkinValueRef: { value: SkinT['value'] | undefined };
  /** 当前主题字符串 */
  theme: string;
  /** 路由实例 */
  router: Router;
}

/**
 * 处理皮肤 link 元素加载完成后的回调
 * @param newVal - 新皮肤值
 * @param oldSkinValueRef - 旧皮肤值引用对象
 * @param theme - 当前主题字符串
 * @param router - 路由实例
 */
async function handleSkinLoad({ newVal, oldSkinValueRef, theme, router }: SkinLoadContext): Promise<void> {
  document.documentElement.dataset.oTheme = theme;
  if (oldSkinValueRef.value !== undefined) {
    document.head.querySelector(`link[data-skin-mark="${LINK_DOM_MARK}${oldSkinValueRef.value}"]`)?.remove();
    await router.isReady();
    updateRouteSkinQuery(router, newVal);
  }
  oldSkinValueRef.value = newVal;
}

export const useThemeStore = defineStore('theme', () => {
  /** 皮肤 */
  const skinValue = ref<SkinT['value']>(DEFAULT_SKIN_VALUE);
  /** 皮肤名称 */
  const skinName = computed(() => resolveSkinName(skinValue.value));
  /** 颜色 */
  const color = ref<ColorT>(DEFAULT_COLOR);
  /** 主题 */
  const theme = computed(() => buildThemeString(skinValue.value, color.value));
  const router = useRouter();

  const oldSkinValueRef = { value: undefined as SkinT['value'] | undefined };
  const setSkin = (newVal: SkinT['value']) => {
    const styleHref = linkConfig[newVal] ?? DEFAULT_SKIN_HREF;
    const linkDom = document.createElement('link');
    linkDom.rel = 'stylesheet';
    linkDom.href = styleHref;
    linkDom.dataset.skinMark = `${LINK_DOM_MARK}${newVal}`;
    document.head.insertBefore(linkDom, document.head.firstElementChild);
    skinValue.value = newVal;
    linkDom.onload = async () => handleSkinLoad({ newVal, oldSkinValueRef, theme: theme.value, router });
  };
  const setColor = async (newVal: ColorT) => {
    color.value = newVal;
    document.documentElement.dataset.oTheme = theme.value;
    await router.isReady();
    updateRouteColorQuery(router, newVal);
  };
  return {
    skinValue: computed(() => skinValue.value),
    skinName,
    color: computed(() => color.value),
    theme,
    setSkin,
    setColor,
  };
});
