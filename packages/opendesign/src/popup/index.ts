import _OPopup from './OPopup.vue';
import type { App } from 'vue';

const OPopup = Object.assign(_OPopup, {
  install(app: App) {
    app.component('OPopup', _OPopup);
  },
});

export { OPopup };
export * from './types';
