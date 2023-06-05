import _OButtonToggle from './OButtonToggle.vue';
import type { App } from 'vue';

const OButtonToggle = Object.assign(_OButtonToggle, {
  install(app: App) {
    app.component(_OButtonToggle.name, _OButtonToggle);
  },
});

export { OButtonToggle };

export * from './types';
