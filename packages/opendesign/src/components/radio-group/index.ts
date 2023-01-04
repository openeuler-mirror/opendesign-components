import type { App } from 'vue';

import _ORadioGroup from './ORadioGroup.vue';

export * from './types';

const ORadioGroup = Object.assign(_ORadioGroup, {
  install(app: App) {
    app.component(_ORadioGroup.name, _ORadioGroup);
  },
});

export { ORadioGroup };
