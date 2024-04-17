import type { App } from 'vue';

import _ODivider from './ODivider.vue';

const ODivider = Object.assign(_ODivider, {
  install(app: App) {
    app.component('ODivider', _ODivider);
  },
});

export { ODivider };
export * from './types';
