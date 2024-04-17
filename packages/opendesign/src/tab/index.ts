import _OTab from './OTab.vue';
import OTabPane from './OTabPane.vue';
import type { App } from 'vue';

const OTab = Object.assign(_OTab, {
  OTabPane,
  install(app: App) {
    app.component('OTab', _OTab);
    app.component('OTabPane', OTabPane);
  },
});

export { OTab, OTabPane };
export * from './types';
