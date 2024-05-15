import type { App } from 'vue';

import _OScroller from './OScroller.vue';
import OScrollbar from './OScrollbar.vue';

import { useScrollbar } from './use-scrollebar';
import { vScrollbar } from './vScrollbar';

const OScroller = Object.assign(_OScroller, {
  OScrollbar,
  install(app: App) {
    app.component('OScroller', _OScroller);
    app.component('OScrollbar', OScrollbar);
  },
});

export { OScroller, OScrollbar, useScrollbar, vScrollbar };
export * from './types';
