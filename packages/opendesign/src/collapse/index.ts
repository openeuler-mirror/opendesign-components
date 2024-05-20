import type { App } from 'vue';

import _OCollapse from './OCollapse.vue';
import OCollapseItem from './OCollapseItem.vue';

const OCollapse = Object.assign(_OCollapse, {
  OCollapseItem,
  install(app: App) {
    app.component('OCollapse', _OCollapse);
    app.component('OCollapseItem', OCollapseItem);
  },
});

export { OCollapse, OCollapseItem };
export * from './types';
