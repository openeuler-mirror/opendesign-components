import _OInputNumber from './OInputNumber.vue';
import type { App } from 'vue';

const OInputNumber = Object.assign(_OInputNumber, {
  install(app: App) {
    app.component('OInputNumber', _OInputNumber);
  },
});
export { OInputNumber };
export * from './types';
