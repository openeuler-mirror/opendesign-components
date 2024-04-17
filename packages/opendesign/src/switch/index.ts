import type { App } from 'vue';

import _OSwitch from './OSwitch.vue';

const OSwitch = Object.assign(_OSwitch, {
  install(app: App) {
    app.component('OSwitch', _OSwitch);
  },
});

export { OSwitch };
export * from './types';
