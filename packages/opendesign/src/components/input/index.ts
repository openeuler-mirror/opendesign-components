import _OInput from './OInput.vue';
import type { App } from 'vue';

const OInput = Object.assign(_OInput, {
  install(app: App) {
    app.component(_OInput.name, _OInput);
  },
});
export { OInput };
export * from './types';
