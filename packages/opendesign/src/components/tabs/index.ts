import _OTabs from './OTabs.vue';
import OTabPane from './OTabPane.vue';
import type { App } from 'vue';

const OTabs = Object.assign(_OTabs, {
  OTabPane,
  install(app: App) {
    app.component(_OTabs.name, _OTabs);
  },
});

export { OTabs, OTabPane };
