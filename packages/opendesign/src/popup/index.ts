import _OPopup from './OPopup.vue';
import type { App } from 'vue';

export * from './types';

const OPopup = Object.assign(_OPopup, {
  install(app: App) {
    app.component(_OPopup.name, _OPopup);
  },
});

export {
  OPopup,
};
