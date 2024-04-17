import type { App } from 'vue';

import _OBadge from './OBadge.vue';

const OBadge = Object.assign(_OBadge, {
  install(app: App) {
    app.component('OBadge', _OBadge);
  },
});

export { OBadge };
export * from './types';
