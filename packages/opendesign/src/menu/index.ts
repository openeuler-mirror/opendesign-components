import type { App } from 'vue';

import _OMenu from './OMenu.vue';
import OSubMenu from './OSubMenu.vue';
import OMenuItem from './OMenuItem.vue';

const OMenu = Object.assign(_OMenu, {
  OSubMenu,
  OMenuItem,
  install(app: App) {
    app.component('OMenu', _OMenu);
    app.component('OMenuItem', OMenuItem);
    app.component('OSubMenu', OSubMenu);
  },
});

export { OMenu, OSubMenu, OMenuItem };
export * from './types';
export * from './provide';
