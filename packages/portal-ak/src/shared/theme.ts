import { computed, ref } from 'vue';
const theme = ref('');

const darkTheme = computed(() => {
  return theme.value.replace('light', 'dark');
});
const lightTheme = computed(() => {
  return theme.value.replace('dark', 'light');
});

export default theme;
export { darkTheme, lightTheme };
