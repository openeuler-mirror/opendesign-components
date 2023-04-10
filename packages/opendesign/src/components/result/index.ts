import type { App } from 'vue';

import _OResult from './OResult.vue';

const OResult = Object.assign(_OResult, {
  install(app: App) {
    app.component(_OResult.name, _OResult);
  },
});

export * from './types';

export { OResult };
