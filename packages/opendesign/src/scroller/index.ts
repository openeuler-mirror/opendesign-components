import type { App } from 'vue';

import _OScroller from './OScroller.vue';
import OScrollbar from './OScrollbar.vue';

const OScroller = Object.assign(_OScroller, {
  OScrollbar,
  install(app: App) {
    app.component(_OScroller.name, _OScroller);
  },
});

export { OScroller, OScrollbar };
