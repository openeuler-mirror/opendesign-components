<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { initIconLoading, initSize } from '@opensig/opendesign/src/components';
import { OIconAdd } from '@opensig/opendesign/src/components/icon-svgs';

const themes = ['default', 'a', 'k'];

const TITLE = 'opendesign';
const ATTR_NAME = 'data-o-theme';
const THEME_KEY = 'o-theme';

const localTheme = localStorage.getItem(THEME_KEY);

const currentStyle = ref(localTheme?.split('-')[1] || 'light');
const currentThemeIdx = ref(Math.max(themes.indexOf(localTheme?.split('-')[0] || 'default'), 0));

const currentThemeAttr = computed(() => {
  if (currentThemeIdx.value === 0) {
    return currentStyle.value;
  }

  return `${themes[currentThemeIdx.value]}-${currentStyle.value}`;
});

watch(
  () => currentThemeAttr.value,
  (val) => {
    document.body.setAttribute(ATTR_NAME, val);
    localStorage.setItem('o-theme', `${themes[currentThemeIdx.value]}-${currentStyle.value}`);
  },
  {
    immediate: true,
  }
);

const changeTheme = () => {
  currentStyle.value = currentStyle.value === 'light' ? 'dark' : 'light';
};

window.addEventListener('keydown', (ev: KeyboardEvent) => {
  if (ev.code === 'Space' || ev.keyCode == 13) {
    currentThemeIdx.value = (currentThemeIdx.value + 1) % themes.length;
    console.log('theme: ', `${themes[currentThemeIdx.value]}-${currentStyle.value}`);
  }
});

const globalSetting = () => {
  initIconLoading(OIconAdd);
  initSize('large');
};
</script>
<template>
  <div class="the-header">
    {{ TITLE }}
    <div class="tools">
      <div class="tool-item" @click="changeTheme">
        <svg v-if="currentStyle === 'light'" version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 32 32">
          <path
            fill="currentColor"
            d="M16 12c2.209 0 4 1.791 4 4s-1.791 4-4 4c-2.209 0-4-1.791-4-4s1.791-4 4-4v0zM16 9.333c-3.682 0-6.667 2.985-6.667 6.667s2.985 6.667 6.667 6.667c3.682 0 6.667-2.985 6.667-6.667s-2.985-6.667-6.667-6.667v0zM15.333 6.667h1.333c0.368 0 0.667-0.298 0.667-0.667v-2.667c0-0.368-0.298-0.667-0.667-0.667h-1.333c-0.368 0-0.667 0.298-0.667 0.667v2.667c0 0.368 0.298 0.667 0.667 0.667zM16.667 25.333h-1.333c-0.368 0-0.667 0.298-0.667 0.667v2.667c0 0.368 0.298 0.667 0.667 0.667h1.333c0.368 0 0.667-0.298 0.667-0.667v-2.667c0-0.368-0.298-0.667-0.667-0.667zM28.667 14.667h-2.667c-0.368 0-0.667 0.298-0.667 0.667v1.333c0 0.368 0.298 0.667 0.667 0.667h2.667c0.368 0 0.667-0.298 0.667-0.667v-1.333c0-0.368-0.298-0.667-0.667-0.667zM6.667 16.667v-1.333c0-0.368-0.298-0.667-0.667-0.667h-2.667c-0.368 0-0.667 0.298-0.667 0.667v1.333c0 0.368 0.298 0.667 0.667 0.667h2.667c0.368 0 0.667-0.298 0.667-0.667zM23.067 9.867c0.125 0.126 0.296 0.197 0.473 0.197s0.348-0.071 0.473-0.197l1.88-1.867c0.126-0.125 0.197-0.296 0.197-0.473s-0.071-0.348-0.197-0.473l-0.933-0.933c-0.125-0.126-0.296-0.197-0.473-0.197s-0.348 0.071-0.473 0.197l-1.88 1.88c-0.126 0.125-0.197 0.296-0.197 0.473s0.071 0.348 0.197 0.473l0.933 0.92zM8.933 22.133c-0.125-0.126-0.296-0.197-0.473-0.197s-0.348 0.071-0.473 0.197l-1.88 1.867c-0.126 0.125-0.197 0.296-0.197 0.473s0.071 0.348 0.197 0.473l0.933 0.933c0.125 0.126 0.296 0.197 0.473 0.197s0.348-0.071 0.473-0.197l1.88-1.88c0.126-0.125 0.197-0.296 0.197-0.473s-0.071-0.348-0.197-0.473l-0.933-0.92zM24 22.133c-0.125-0.126-0.296-0.197-0.473-0.197s-0.348 0.071-0.473 0.197l-0.933 0.933c-0.126 0.125-0.197 0.296-0.197 0.473s0.071 0.348 0.197 0.473l1.88 1.88c0.125 0.126 0.296 0.197 0.473 0.197s0.348-0.071 0.473-0.197l0.933-0.933c0.126-0.125 0.197-0.296 0.197-0.473s-0.071-0.348-0.197-0.473l-1.88-1.88zM8 9.867c0.125 0.126 0.296 0.197 0.473 0.197s0.348-0.071 0.473-0.197l0.933-0.933c0.25-0.263 0.245-0.678-0.013-0.933l-1.867-1.893c-0.125-0.126-0.296-0.197-0.473-0.197s-0.348 0.071-0.473 0.197l-0.933 0.933c-0.126 0.125-0.197 0.296-0.197 0.473s0.071 0.348 0.197 0.473l1.88 1.88z"
          />
        </svg>
        <svg v-else version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 32 32" data-v-0d20eb0c="">
          <path
            fill="currentColor"
            d="M10.643 6.363c0.282 3.891 1.958 7.55 4.72 10.302 2.744 2.744 6.384 4.407 10.253 4.684-2.324 3.939-6.85 6.016-11.348 5.207s-8.019-4.333-8.828-8.835c-0.808-4.502 1.267-9.033 5.203-11.358v0zM12.523 2.667h-0.187c-6.218 1.884-10.24 7.902-9.604 14.374s5.751 11.591 12.216 12.227c6.466 0.636 12.479-3.389 14.361-9.613v0c0.064-0.242-0.002-0.499-0.173-0.681l-0.12-0.12c-0.138-0.125-0.321-0.187-0.507-0.174h-0.080c-0.54 0.069-1.083 0.104-1.627 0.107-3.89 0.002-7.595-1-10.175-4.58s-3.788-6.795-3.319-10.66c0.015-0.207-0.057-0.41-0.2-0.561l-0.12-0.12c-0.124-0.125-0.291-0.196-0.467-0.2z"
          />
        </svg>
      </div>
      <div class="tool-item" @click="globalSetting">全局设置</div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.the-header {
  color: var(--o-color-info1);
  display: flex;
  align-items: center;
  font-size: var(--o-font_size-h3);
  line-height: var(--o-font_size-h3);
  justify-content: center;
  background-color: var(--o-color-fill2);
  box-shadow: 0px 1px 1px rgba(var(--o-gray-10), 0.1);
}
.tools {
  position: absolute;
  right: 24px;
  display: flex;
  align-items: center;
  color: var(--o-color-info1);

  .tool-item {
    cursor: pointer;
    & + .tool-item {
      margin-left: 24px;
    }
  }
}
</style>
