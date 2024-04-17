import _ODatePicker from './ODatePicker.vue';
import _ODateRangePicker from './ODateRangePicker.vue';
import type { App } from 'vue';

const ODatePicker = Object.assign(_ODatePicker, {
  install(app: App) {
    app.component('ODatePicker', _ODatePicker);
  },
});

const ODateRangePicker = Object.assign(_ODateRangePicker, {
  install(app: App) {
    app.component('ODateRangePicker', _ODateRangePicker);
  },
});

export { ODatePicker, ODateRangePicker };
export * from './types';
