import type { App } from 'vue';

import _OTag from './OTag.vue';

const OTag = Object.assign(_OTag, {
  install(app: App) {
    app.component('OTag', _OTag);
  },
});

export { OTag };
export * from './types';
