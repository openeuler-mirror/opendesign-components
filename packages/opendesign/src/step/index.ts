import type { App } from 'vue';

import _OStep from './OStep.vue';
import OStepItem from './OStepItem.vue';

const OStep = Object.assign(_OStep, {
  OStepItem,
  install(app: App) {
    app.component('OStep', _OStep);
    app.component('OStepItem', OStepItem);
  },
});

export { OStep, OStepItem };
export * from './types';
