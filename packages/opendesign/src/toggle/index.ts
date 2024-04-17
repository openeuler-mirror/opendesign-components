import _OButtonToggle from './OToggle.vue';
import type { App } from 'vue';

const OToggle = Object.assign(_OButtonToggle, {
  install(app: App) {
    app.component('OButtonToggle', _OButtonToggle);
  },
});

export { OToggle };
export * from './types';
