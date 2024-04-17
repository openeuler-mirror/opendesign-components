import type { App } from 'vue';

import _OProgress from './OProgress.vue';

const OProgress = Object.assign(_OProgress, {
  install(app: App) {
    app.component('OProgress', _OProgress);
  },
});

export { OProgress };
export * from './types';
