import _OConfigProvider from './OConfigProvider.vue';
import type { App } from 'vue';

const OConfigProvider = Object.assign(_OConfigProvider, {
  install(app: App) {
    app.component(_OConfigProvider.name, _OConfigProvider);
  },
});

export { OConfigProvider };

export * from './types';
export * from './provide';
