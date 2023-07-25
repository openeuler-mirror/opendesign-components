import type { App } from 'vue';

import _OMenu from './OMenu.vue';
import _OSubMenu from './OSubMenu.vue';
import _OMenuItem from './OMenuItem.vue';

const OMenu = Object.assign(_OMenu, {
  install(app: App) {
    app.component(_OMenu.name, _OMenu);
  },
});

const OSubMenu = Object.assign(_OSubMenu, {
  install(app: App) {
    app.component(_OSubMenu.name, _OSubMenu);
  },
});

const OMenuItem = Object.assign(_OMenuItem, {
  install(app: App) {
    app.component(_OMenuItem.name, _OMenuItem);
  },
});
export { OMenu, OSubMenu, OMenuItem };
