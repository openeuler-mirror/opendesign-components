import { ref, watchEffect } from 'vue';
const THEME_KEY = '__theme__';

// 全局状态
export const theme = ref<string>(localStorage.getItem(THEME_KEY) || 'light');
watchEffect(() => {
  document.documentElement.dataset.oTheme = theme.value;
  localStorage.setItem(THEME_KEY, theme.value);
});
