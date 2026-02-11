import type { App } from 'vue';

import _OIpInput from './OIpInput.vue';

const OIpInput = Object.assign(_OIpInput, {
  install(app: App) {
    app.component('OIpInput', _OIpInput);
  },
});

export { OIpInput };
export * from './types';
