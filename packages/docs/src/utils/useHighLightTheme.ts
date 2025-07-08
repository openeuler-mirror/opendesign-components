import { Ref, watchEffect } from 'vue';
import light from 'highlight.js/styles/github.css?url';
import dark from 'highlight.js/styles/github-dark.css?url';

export function useHighLightTheme(theme: Ref<string>) {
  watchEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    if (theme.value.includes('dark')) {
      link.href = dark;
      document.head.appendChild(link);
      const lightLink = document.querySelector(`link[href="${light}"]`);
      lightLink?.remove();
    } else {
      link.href = light;
      document.head.appendChild(link);
      const darkLink = document.querySelector(`link[href="${dark}"]`);
      darkLink?.remove();
    }
  });
}
