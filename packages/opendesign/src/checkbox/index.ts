import type { App } from 'vue';

import _OCheckbox from './OCheckbox.vue';

const OCheckbox = Object.assign(_OCheckbox, {
  install(app: App) {
    app.component('OCheckbox', _OCheckbox);
  },
});

export { OCheckbox };
export * from './types';
