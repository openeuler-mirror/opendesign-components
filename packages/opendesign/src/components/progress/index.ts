import type { App } from 'vue';

import _OProgress from './OProgress.vue';

const OProgress = Object.assign(_OProgress, {
  install(app: App) {
    app.component(_OProgress.name, _OProgress);
  },
});

export * from './types';

export { OProgress };
