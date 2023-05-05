import type { App } from 'vue';

import _OCheckboxGroup from './OCheckboxGroup.vue';

const OCheckboxGroup = Object.assign(_OCheckboxGroup, {
  install(app: App) {
    app.component(_OCheckboxGroup.name, _OCheckboxGroup);
  },
});

export * from './types';

export { OCheckboxGroup };
