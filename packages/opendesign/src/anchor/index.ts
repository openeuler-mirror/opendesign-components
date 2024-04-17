import type { App } from 'vue';

import _OAnchor from './OAnchor.vue';
import OAnchorItem from './OAnchorItem.vue';

const OAnchor = Object.assign(_OAnchor, {
  OAnchorItem,
  install(app: App) {
    app.component('OAnchor', _OAnchor);
    app.component('OAnchorItem', OAnchorItem);
  },
});

export { OAnchor, OAnchorItem };
export * from './types';
