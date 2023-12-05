import { ref, watchEffect } from 'vue';

const THEME_KEY = '__theme__';

const currentTheme = ref<string>(localStorage.getItem(THEME_KEY) || 'light');

watchEffect(() => {
  const theme = currentTheme.value;

  document.documentElement.dataset.oTheme = theme;

  localStorage.setItem(THEME_KEY, theme);
});

export function useTheme() {
  return {
    theme: currentTheme,
  };
}
