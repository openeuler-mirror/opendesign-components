import type { App } from 'vue';

import _ODivider from './ODivider.vue';

export * from './types';

const ODivider = Object.assign(_ODivider, {
  install(app: App) {
    app.component(_ODivider.name, _ODivider);
  },
});

export { ODivider };
