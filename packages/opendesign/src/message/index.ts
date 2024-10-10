import type { App } from 'vue';

import _OMessage from './OMessage.vue';
import { useMessage } from './use-message';

const OMessage = Object.assign(_OMessage, {
  install(app: App) {
    app.component('OMessage', _OMessage);
  },
});

export { OMessage, useMessage };
export * from './types';
