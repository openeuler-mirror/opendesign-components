import _ODialog from './ODialog.vue';
import type { App } from 'vue';

const ODialog = Object.assign(_ODialog, {
  install(app: App) {
    app.component('ODialog', _ODialog);
  },
});

export { ODialog };
export * from './types';
