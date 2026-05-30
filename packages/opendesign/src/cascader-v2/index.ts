import type { App } from 'vue';

import _OCascaderV2 from './OCascaderV2.vue';
import OCascaderV2Panel from './OCascaderV2Panel.vue';
import { cascaderV2InjectKey } from './provide';

const OCascaderV2 = Object.assign(_OCascaderV2, {
  OCascaderV2Panel,
  install(app: App) {
    app.component('OCascaderV2', _OCascaderV2);
    app.component('OCascaderV2Panel', OCascaderV2Panel);
  },
});

export { OCascaderV2, OCascaderV2Panel, cascaderV2InjectKey };
export * from './types';
