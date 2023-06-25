import type { App } from 'vue';

import _ODropdown from './ODropdown.vue';
import _ODropdownItem from './ODropdownItem.vue';

const ODropdown = Object.assign(_ODropdown, {
  install(app: App) {
    app.component(_ODropdown.name, _ODropdown);
  },
});

const ODropdownItem = Object.assign(_ODropdownItem, {
  install(app: App) {
    app.component(_ODropdownItem.name, _ODropdownItem);
  },
});

export { ODropdown, ODropdownItem };
