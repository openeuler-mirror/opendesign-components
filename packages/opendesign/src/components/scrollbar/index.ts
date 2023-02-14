import type { App } from 'vue';

import _OScrollbar from './OScrollbar.vue';

const OScrollbar = Object.assign(_OScrollbar, {
  install(app: App) {
    app.component(_OScrollbar.name, _OScrollbar);
  },
});

export { OScrollbar };
