import type { App } from 'vue';

import _OCascader from './OCascader.vue';

const OCascader = Object.assign(_OCascader, {
  install(app: App) {
    app.component(_OCascader.name, _OCascader);
  },
});

export * from './types';

export { OCascader };
