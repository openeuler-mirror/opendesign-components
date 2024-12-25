import type { App } from 'vue';

import _OCascader from './OCascader.vue';
import OCascaderPanel from './OCascaderPanel.vue';

const OCascader = Object.assign(_OCascader, {
  OCascaderPanel,
  install(app: App) {
    app.component('OCascader', _OCascader);
    app.component('OCascaderPanel', OCascaderPanel);
  },
});

export { OCascader, OCascaderPanel };
export * from './types';
