import _OTable from './OTable.vue';
import type { App } from 'vue';

const OTable = Object.assign(_OTable, {
  install(app: App) {
    app.component('OTable', _OTable);
  },
});

export { OTable };
export * from './types';
