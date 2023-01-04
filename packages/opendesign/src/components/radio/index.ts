import type { App } from 'vue';

import _ORadio from './ORadio.vue';
import _ORadioGroup from '../radio/ORadioGroup.vue';

export * from './types';

const ORadio = Object.assign(_ORadio, {
  install(app: App) {
    app.component(_ORadio.name, _ORadio);
  },
});

const ORadioGroup = Object.assign(_ORadioGroup, {
  install(app: App) {
    app.component(_ORadioGroup.name, _ORadioGroup);
  },
});

export { ORadio, ORadioGroup };
