import type { App } from 'vue';

import _OBadge from './OBadge.vue';

export * from './types';

const OBadge = Object.assign(_OBadge, {
  install(app: App) {
    app.component(_OBadge.name, _OBadge);
  },
});

export { OBadge };
