import _OTimePicker from './OTimePicker.vue';
import _OTimeRangePicker from './OTimeRangePicker.vue';
import type { App } from 'vue';

const OTimePicker = Object.assign(_OTimePicker, {
  install(app: App) {
    app.component('OTimePicker', _OTimePicker);
  },
});
const OTimeRangePicker = Object.assign(_OTimeRangePicker, {
  install(app: App) {
    app.component('OTimeRangePicker', _OTimeRangePicker);
  },
});

export { OTimePicker, OTimeRangePicker };
export * from './types';
