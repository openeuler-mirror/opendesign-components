import type { App } from 'vue';

import _OCheckboxGroup from './OCheckboxGroup.vue';

export * from './types';

const OCheckboxGroup = Object.assign(_OCheckboxGroup, {
  install(app: App) {
    app.component(_OCheckboxGroup.name, _OCheckboxGroup);
  },
});

export { OCheckboxGroup };
