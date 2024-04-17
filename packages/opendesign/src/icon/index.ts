import _OIcon from './OIcon.vue';
import type { App } from 'vue';

const OIcon = Object.assign(_OIcon, {
  install(app: App) {
    app.component('OIcon', _OIcon);
  },
});
export { OIcon };
export * from './types';
