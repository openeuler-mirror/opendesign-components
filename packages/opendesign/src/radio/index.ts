import type { App } from 'vue';

import _ORadio from './ORadio.vue';

const ORadio = Object.assign(_ORadio, {
  install(app: App) {
    app.component('ORadio', _ORadio);
  },
});

export { ORadio };
export * from './types';
