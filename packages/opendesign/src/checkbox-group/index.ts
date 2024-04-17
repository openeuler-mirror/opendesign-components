import type { App } from 'vue';

import _OCheckboxGroup from './OCheckboxGroup.vue';

const OCheckboxGroup = Object.assign(_OCheckboxGroup, {
  install(app: App) {
    app.component('OCheckboxGroup', _OCheckboxGroup);
  },
});

export { OCheckboxGroup };
export * from './types';
