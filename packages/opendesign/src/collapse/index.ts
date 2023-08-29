import type { App } from 'vue';

import _OCollapse from './OCollapse.vue';
import _OCollapseItem from './OCollapseItem.vue';

export * from './types';

const OCollapse = Object.assign(_OCollapse, {
  install(app: App) {
    app.component(_OCollapse.name, _OCollapse);
  },
});

const OCollapseItem = Object.assign(_OCollapseItem, {
  install(app: App) {
    app.component(_OCollapseItem.name, _OCollapseItem);
  },
});

export { OCollapse, OCollapseItem };
