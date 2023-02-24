import type { App } from 'vue';

import _ORate from './ORate.vue';

export * from './types';

const ORate = Object.assign(_ORate, {
  install(app: App) {
    app.component(_ORate.name, _ORate);
  },
});

export { ORate };
