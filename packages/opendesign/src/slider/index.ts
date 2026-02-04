import type { App } from 'vue';

import _OSlider from './OSlider.vue';

const OSlider = Object.assign(_OSlider, {
  install(app: App) {
    app.component('OSlider', _OSlider);
  },
});

export { OSlider };
export * from './types';
