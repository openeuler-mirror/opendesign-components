import _OTextarea from './OTextarea.vue';
import type { App } from 'vue';

const OTextarea = Object.assign(_OTextarea, {
  install(app: App) {
    app.component('OTextarea', _OTextarea);
  },
});

export { OTextarea };
export * from './types';
