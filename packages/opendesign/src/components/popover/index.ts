import _OPopover from './OPopover.vue';
import type { App } from 'vue';

export * from './types';

const OPopover = Object.assign(_OPopover, {
  install(app: App) {
    app.component(_OPopover.name, _OPopover);
  },
});

export {
  OPopover,
};
