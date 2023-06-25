import _ODatePicker from './ODatePicker.vue';
import type { App } from 'vue';

const ODatePicker = Object.assign(_ODatePicker, {
  install(app: App) {
    app.component(_ODatePicker.name, _ODatePicker);
  },
});
export { ODatePicker };
