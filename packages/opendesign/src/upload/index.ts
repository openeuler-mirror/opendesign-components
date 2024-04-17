import _OUpload from './OUpload.vue';
import type { App } from 'vue';

const OUpload = Object.assign(_OUpload, {
  install(app: App) {
    app.component('OUpload', _OUpload);
  },
});

export { OUpload };
export * from './types';
