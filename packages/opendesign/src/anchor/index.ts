import type { App } from 'vue';

import _OAnchor from './OAnchor.vue';
import _OAnchorItem from './OAnchorItem.vue';

const OAnchor = Object.assign(_OAnchor, {
  install(app: App) {
    app.component(_OAnchor.name, _OAnchor);
  },
});

const OAnchorItem = Object.assign(_OAnchorItem, {
  install(app: App) {
    app.component(_OAnchorItem.name, _OAnchorItem);
  },
});

export * from './types';

export { OAnchor, OAnchorItem };
