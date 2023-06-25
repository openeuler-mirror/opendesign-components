import _OIcon from './OIcon.vue';
import type { App } from 'vue';

const OIcon = Object.assign(_OIcon, {
  install(app: App) {
    app.component(_OIcon.name, _OIcon);
  },
});
export { OIcon };
export * from './types';
