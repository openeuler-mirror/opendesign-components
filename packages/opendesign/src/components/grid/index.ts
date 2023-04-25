import _ORow from './ORow.vue';
import OCol from './OCol.vue';
import type { App } from 'vue';

const ORow = Object.assign(_ORow, {
  OCol,
  install(app: App) {
    app.component(_ORow.name, _ORow);
    app.component(OCol.name, OCol);
  },
});

export { ORow, OCol };
export * from './types';
