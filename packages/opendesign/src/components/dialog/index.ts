import _ODialog from './ODialog.vue';
import type { App } from 'vue';

const ODialog = Object.assign(_ODialog, {
  install(app: App) {
    app.component(_ODialog.name, _ODialog);
  },
});

export {
  ODialog,
};
