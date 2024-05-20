import type { App } from 'vue';

import _ORate from './ORate.vue';

const ORate = Object.assign(_ORate, {
  install(app: App) {
    app.component('ORate', _ORate);
  },
});

export { ORate };
export * from './types';
