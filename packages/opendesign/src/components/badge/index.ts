import type { App } from 'vue';

import _OBadge from './OBadge.vue';

const OBadge = Object.assign(_OBadge, {
  install(app: App) {
    app.component(_OBadge.name, _OBadge);
  },
});

export * from './types';

export { OBadge };
