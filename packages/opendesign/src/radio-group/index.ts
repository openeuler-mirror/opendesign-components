import type { App } from 'vue';

import _ORadioGroup from './ORadioGroup.vue';

const ORadioGroup = Object.assign(_ORadioGroup, {
  install(app: App) {
    app.component('ORadioGroup', _ORadioGroup);
  },
});

export { ORadioGroup };
export * from './types';
