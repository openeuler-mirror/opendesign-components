import _OUpload from './OUpload.vue';
import type { App } from 'vue';

const OUpload = Object.assign(_OUpload, {
  install(app: App) {
    app.component(_OUpload.name, _OUpload);
  },
});

export { OUpload };
export * from './types';
