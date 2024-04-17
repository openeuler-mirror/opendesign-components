import _OPopover from './OPopover.vue';
import type { App } from 'vue';

const OPopover = Object.assign(_OPopover, {
  install(app: App) {
    app.component('OPopover', _OPopover);
  },
});

export { OPopover };
export * from './types';
