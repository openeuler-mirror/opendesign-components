import type { App } from 'vue';

import _OMessage from './OMessage.vue';
import useMessage from './use-message';

const OMessage = Object.assign(_OMessage, {
  install(app: App) {
    app.component(_OMessage.name, _OMessage);
  },
});

export * from './types';

export { OMessage, useMessage };
