import { isClient } from '../_utils/is';
import { ref, watchEffect } from 'vue';

const THEME_KEY = '__theme__';

export function useTheme(defaultTheme: string = 'light') {
  if (!isClient) {
    return {
      theme: ref(defaultTheme),
    };
  }
  const currentTheme = ref<string>(localStorage.getItem(THEME_KEY) || defaultTheme);

  watchEffect(() => {
    const theme = currentTheme.value;

    document.documentElement.dataset.oTheme = theme;

    localStorage.setItem(THEME_KEY, theme);
  });

  return {
    theme: currentTheme,
  };
}
