import type { App } from 'vue';

import _ODropdown from './ODropdown.vue';
import ODropdownItem from './ODropdownItem.vue';

const ODropdown = Object.assign(_ODropdown, {
  ODropdownItem,
  install(app: App) {
    app.component(_ODropdown.name, _ODropdown);
    app.component(ODropdownItem.name, ODropdownItem);
  },
});

export { ODropdown, ODropdownItem };
