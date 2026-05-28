import _OYearPicker from './OYearPicker.vue';
import _OMonthPicker from './OMonthPicker.vue';
import _ODatePicker from './ODatePicker.vue';
import _ODateTimePicker from './ODateTimePicker.vue';
import _OYearRangePicker from './OYearRangePicker.vue';
import _OMonthRangePicker from './OMonthRangePicker.vue';
import _ODateRangePicker from './ODateRangePicker.vue';
import _ODateTimeRangePicker from './ODateTimeRangePicker.vue';
import type { App } from 'vue';

const OYearPicker = Object.assign(_OYearPicker, {
  install(app: App) {
    app.component('OYearPicker', _OYearPicker);
  },
});

const OMonthPicker = Object.assign(_OMonthPicker, {
  install(app: App) {
    app.component('OMonthPicker', _OMonthPicker);
  },
});

const ODatePicker = Object.assign(_ODatePicker, {
  install(app: App) {
    app.component('ODatePicker', _ODatePicker);
  },
});

const ODateTimePicker = Object.assign(_ODateTimePicker, {
  install(app: App) {
    app.component('ODateTimePicker', _ODateTimePicker);
  },
});

const OYearRangePicker = Object.assign(_OYearRangePicker, {
  install(app: App) {
    app.component('OYearRangePicker', _OYearRangePicker);
  },
});

const OMonthRangePicker = Object.assign(_OMonthRangePicker, {
  install(app: App) {
    app.component('OMonthRangePicker', _OMonthRangePicker);
  },
});

const ODateRangePicker = Object.assign(_ODateRangePicker, {
  install(app: App) {
    app.component('ODateRangePicker', _ODateRangePicker);
  },
});

const ODateTimeRangePicker = Object.assign(_ODateTimeRangePicker, {
  install(app: App) {
    app.component('ODateTimeRangePicker', _ODateTimeRangePicker);
  },
});

export { OYearPicker, OMonthPicker, ODatePicker, ODateTimePicker, OYearRangePicker, OMonthRangePicker, ODateRangePicker, ODateTimeRangePicker };
export * from './types';
