import { isFunction } from 'src/_utils/is';
import { ref, watchEffect } from 'vue';

const THEME_KEY = '__theme__';

const currentTheme = ref<string>('');

interface ThemeSetting {
  onChange?: (theme: string) => void;
}
const settings: ThemeSetting = {};

let initialized = false;

const initTheme = (theme?: string, onChange?: ((theme: string) => void) | null) => {
  currentTheme.value = localStorage.getItem(THEME_KEY) || theme || 'light';
  if (isFunction(onChange)) {
    settings.onChange = onChange;
  }
  document.documentElement.dataset.theme = currentTheme.value;
  initialized = true;
};

watchEffect(() => {
  if (!initialized) {
    return;
  }
  const theme = currentTheme.value;
  if (settings.onChange) {
    settings.onChange(theme);
  }
  localStorage.setItem(THEME_KEY, theme);
});

export function useTheme() {
  return {
    initTheme,
    theme: currentTheme,
  };
}
