import _OSelect from './OSelect.vue';
import type { App } from 'vue';

const OSelect = Object.assign(_OSelect, {
  install(app: App) {
    app.component(_OSelect.name, _OSelect);
  },
});
export { OSelect };
