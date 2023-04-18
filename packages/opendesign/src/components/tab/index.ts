import _OTab from './OTab.vue';
import OTabPane from './OTabPane.vue';
import type { App } from 'vue';

const OTab = Object.assign(_OTab, {
  OTabPane,
  install(app: App) {
    app.component(_OTab.name, _OTab);
    app.component(OTabPane.name, OTabPane);
  },
});

export { OTab, OTabPane };
