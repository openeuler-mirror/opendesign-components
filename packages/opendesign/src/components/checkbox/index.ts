import type { App } from 'vue';

import _OCheckbox from './OCheckbox.vue';

const OCheckbox = Object.assign(_OCheckbox, {
  install(app: App) {
    app.component(_OCheckbox.name, _OCheckbox);
  },
});

export { OCheckbox };
