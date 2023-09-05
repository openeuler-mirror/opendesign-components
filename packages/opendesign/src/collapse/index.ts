import type { App } from 'vue';

import _OCollapse from './OCollapse.vue';
import OCollapseItem from './OCollapseItem.vue';

export * from './types';

const OCollapse = Object.assign(_OCollapse, {
  OCollapseItem,
  install(app: App) {
    app.component(_OCollapse.name, _OCollapse);
    app.component(OCollapseItem.name, OCollapseItem);
  },
});

export { OCollapse, OCollapseItem };
