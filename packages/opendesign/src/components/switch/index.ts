import type { App } from 'vue';

import _OSWitch from './OSwitch.vue';

const OSWitch = Object.assign(_OSWitch, {
  install(app: App) {
    app.component(_OSWitch.name, _OSWitch);
  },
});

export { OSWitch };
