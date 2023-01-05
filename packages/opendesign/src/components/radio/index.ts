import type { App } from 'vue';

import _ORadio from './ORadio.vue';

export * from '../radio-group/types';

const ORadio = Object.assign(_ORadio, {
  install(app: App) {
    app.component(_ORadio.name, _ORadio);
  },
});

export { ORadio };
