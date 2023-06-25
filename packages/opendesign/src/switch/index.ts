import type { App } from 'vue';

import _OSwitch from './OSwitch.vue';

const OSwitch = Object.assign(_OSwitch, {
  install(app: App) {
    app.component(_OSwitch.name, _OSwitch);
  },
});

export * from './types';

export { OSwitch };
