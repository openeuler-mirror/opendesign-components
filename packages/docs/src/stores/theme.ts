import { computed, ref, watch } from 'vue';
import { defineStore } from 'pinia';
import openDesignSkin from '@opensig/opendesign/theme/opendesign/index.scss?url';
import kunpengSkin from '@opensig/opendesign/theme/kunpeng/index.scss?url';
import ascendSkin from '@opensig/opendesign/theme/ascend/index.scss?url';
import eulerSkin from '@opensig/opendesign/theme/openeuler/index.scss?url';

const THEME_KEY = '__doc-theme__';

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
export const colors = ['light', 'dark'] as const;
export type ColorT = (typeof colors)[number];
let preStyleHref = '';
const linkConfig: Record<string, string> = {
  e: eulerSkin,
  k: kunpengSkin,
  a: ascendSkin,
};

export const parseTheme = (theme: string) => {
  const sc = theme.split('.');
  const res = { skin: '', color: '' };
  if (sc.length === 2) {
    res.skin = sc[0];
    res.color = sc[1];
  } else {
    res.color = sc[0];
  }
  if (!skin.some((item) => item.value === res.skin)) {
    res.skin = '';
  }
  if (!colors.some((item) => item === res.color)) {
    res.color = colors[0];
  }
  return res as { skin: SkinT['value']; color: ColorT };
};

export const useThemeStore = defineStore('theme', () => {
  const { skin: defaultSkin, color: defaultColor } = parseTheme(localStorage.getItem(THEME_KEY) || '');
  /** 皮肤 */
  const skinValue = ref(defaultSkin);
  /** 皮肤名称 */
  const skinName = computed(() => skin.find((item) => item.value === skinValue.value)?.name || 'OpenDesign');
  /** 颜色 */
  const color = ref(defaultColor);
  /** 主题 */
  const theme = computed(() => `${skinValue.value ? `${skinValue.value}.` : ''}${color.value}`);

  const applyTheme = (themeValue: string) => {
    document.documentElement.dataset.oTheme = themeValue;
    localStorage.setItem(THEME_KEY, themeValue);
  };
  watch(
    theme,
    (val) => {
      const styleHref = linkConfig[skinValue.value] || openDesignSkin;

      if (preStyleHref !== styleHref) {
        // 注入皮肤 css
        const linkDom = document.createElement('link');
        linkDom.rel = 'stylesheet';
        linkDom.href = styleHref;
        linkDom.onload = () => {
          applyTheme(val);
          document.querySelector(`link[href="${preStyleHref}"]`)?.remove();
          preStyleHref = styleHref;
        };
        document.head.insertBefore(linkDom, document.head.firstChild);
      } else {
        // 仅深浅色改变，皮肤不变
        applyTheme(val);
      }
    },
    { immediate: true },
  );

  return {
    skinValue,
    skinName,
    color,
    theme,
  };
});
