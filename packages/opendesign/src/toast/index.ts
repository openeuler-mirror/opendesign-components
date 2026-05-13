import type { App } from 'vue';

import _OToast from './OToast.vue';

import { useToast } from './use-toast';

const OToast = Object.assign(_OToast, {
  install(app: App) {
    app.component('OToast', _OToast);
  },
});

export { OToast, useToast };
export * from './types';
