import { isClient } from '../_utils/is';
import { ref, watch } from 'vue';

const THEME_KEY = '__theme__';
const rootTheme = ref('');

watch(rootTheme, (newTheme) => {
  document.documentElement.dataset.oTheme = newTheme;
  localStorage.setItem(THEME_KEY, newTheme);
});

/**
 * 获取全局主题，该主题自动在html根元素上设置 data-o-theme 属性。多个组件和标签页使用同一个全局主题。
 * 若想在不同的组件中使用不同的主题，可以在该组件的根元素上手动设置 data-o-theme 属性
 * @param defaultTheme 默认主题
 */
export function useTheme(defaultTheme: string = 'light') {
  if (!isClient) {
    return {
      theme: rootTheme,
    };
  }
  rootTheme.value = rootTheme.value || localStorage.getItem(THEME_KEY) || defaultTheme;

  return {
    theme: rootTheme,
  };
}
