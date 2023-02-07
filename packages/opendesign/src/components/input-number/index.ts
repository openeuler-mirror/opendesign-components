import _OInputNumber from './OInputNumber.vue';
import type { App } from 'vue';

const OInputNumber = Object.assign(_OInputNumber, {
  install(app: App) {
    app.component(_OInputNumber.name, _OInputNumber);
  },
});
export { OInputNumber };
