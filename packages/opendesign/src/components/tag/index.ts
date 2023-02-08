import type { App } from 'vue';

import _OTag from './OTag.vue';

const OTag = Object.assign(_OTag, {
  install(app: App) {
    app.component(_OTag.name, _OTag);
  },
});

export { OTag };
