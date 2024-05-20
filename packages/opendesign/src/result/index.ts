import type { App } from 'vue';

import _OResult from './OResult.vue';

const OResult = Object.assign(_OResult, {
  install(app: App) {
    app.component('OResult', _OResult);
  },
});

export { OResult };
export * from './types';
