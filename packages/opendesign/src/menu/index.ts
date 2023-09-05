import type { App } from 'vue';

import _OMenu from './OMenu.vue';
import OSubMenu from './OSubMenu.vue';
import OMenuItem from './OMenuItem.vue';

const OMenu = Object.assign(_OMenu, {
  OSubMenu,
  OMenuItem,
  install(app: App) {
    app.component(_OMenu.name, _OMenu);
    app.component(OMenuItem.name, OMenuItem);
    app.component(OSubMenu.name, OSubMenu);
  },
});

export { OMenu, OSubMenu, OMenuItem };
