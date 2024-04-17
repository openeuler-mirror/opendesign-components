import _OLink from './OLink.vue';
import type { App } from 'vue';

const OLink = Object.assign(_OLink, {
  install(app: App) {
    app.component('OLink', _OLink);
  },
});

export { OLink };
export * from './types';
