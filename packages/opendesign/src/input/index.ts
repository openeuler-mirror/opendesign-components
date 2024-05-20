import _OInput from './OInput.vue';
import type { App } from 'vue';

const OInput = Object.assign(_OInput, {
  install(app: App) {
    app.component('OInput', _OInput);
  },
});

export { OInput };
export * from './types';
