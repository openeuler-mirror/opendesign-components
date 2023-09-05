import type { App } from 'vue';

import _OAnchor from './OAnchor.vue';
import OAnchorItem from './OAnchorItem.vue';

const OAnchor = Object.assign(_OAnchor, {
  OAnchorItem,
  install(app: App) {
    app.component(_OAnchor.name, _OAnchor);
    app.component(OAnchorItem.name, OAnchorItem);
  },
});

export * from './types';

export { OAnchor, OAnchorItem };
