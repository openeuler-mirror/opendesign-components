import type { App } from 'vue';

import _OCascader from './OCascader.vue';

const OCascader = Object.assign(_OCascader, {
  install(app: App) {
    app.component('OCascader', _OCascader);
  },
});

export { OCascader };
export * from './types';
