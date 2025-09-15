import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { defineStore } from 'pinia';
import { usePrefetch } from '@/utils/optimize';
import openDesignSkin from '@opensig/opendesign/theme/opendesign/index.scss?url';
import kunpengSkin from '@opensig/opendesign/theme/kunpeng/index.scss?url';
import ascendSkin from '@opensig/opendesign/theme/ascend/index.scss?url';
import eulerSkin from '@opensig/opendesign/theme/openeuler/index.scss?url';

export const skin = [
  {
    value: '',
    name: 'OpenDesign',
  },
  {
    value: 'e',
    name: 'OpenEuler',
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
  e: eulerSkin,
  k: kunpengSkin,
  a: ascendSkin,
};
usePrefetch([
  { url: openDesignSkin, as: 'style' },
  { url: kunpengSkin, as: 'style' },
  { url: ascendSkin, as: 'style' },
  { url: eulerSkin, as: 'style' },
]);
const LINK_DOM_MARK = '__docs_theme_link_dom__';
export const QUERY_SKIN = '__skin';
export const QUERY_COLOR = '__color';
export const DEFAULT_COLOR = 'light';
export const DEFAULT_SKIN_VALUE = '';
export const DEFAULT_SKIN_HREF = openDesignSkin;

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
export const useThemeStore = defineStore('theme', () => {
  /** 皮肤 */
  const skinValue = ref<SkinT['value']>('');
  /** 皮肤名称 */
  const skinName = computed(() => skinMap.get(skinValue.value) || skinMap.get(DEFAULT_SKIN_VALUE));
  /** 颜色 */
  const color = ref(DEFAULT_COLOR);
  /** 主题 */
  const theme = computed(() => `${skinValue.value ? `${skinValue.value}.` : ''}${color.value}`);
  const router = useRouter();

  let oldSkinValue: SkinT['value'] | undefined = undefined;
  const setSkin = (newVal: SkinT['value']) => {
    const styleHref = linkConfig[newVal] || DEFAULT_SKIN_HREF;
    const linkDom = document.createElement('link');
    linkDom.rel = 'stylesheet';
    linkDom.href = styleHref;
    linkDom.dataset.skinMark = `${LINK_DOM_MARK}${newVal}`;
    document.head.insertBefore(linkDom, document.head.firstElementChild);
    linkDom.onload = async () => {
      skinValue.value = newVal;
      document.documentElement.dataset.oTheme = theme.value;
      if (oldSkinValue !== undefined) {
        document.head.querySelector(`link[data-skin-mark="${LINK_DOM_MARK}${oldSkinValue}"]`)?.remove();
        await router.isReady();
        const route = router.currentRoute.value;
        if (route.matched.length) {
          router.replace({ ...route, query: { ...route.query, [QUERY_SKIN]: newVal === DEFAULT_SKIN_VALUE ? undefined : newVal } });
        }
      }
      oldSkinValue = newVal;
    };
  };
  const setColor = async (newVal: ColorT) => {
    color.value = newVal;
    document.documentElement.dataset.oTheme = theme.value;
    await router.isReady();
    const route = router.currentRoute.value;
    if (route.matched.length) {
      router.replace({ ...route, query: { ...route.query, [QUERY_COLOR]: newVal === DEFAULT_COLOR ? undefined : newVal } });
    }
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
