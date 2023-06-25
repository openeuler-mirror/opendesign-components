import _OTable from './OTable.vue';
import type { App } from 'vue';

const OTable = Object.assign(_OTable, {
  install(app: App) {
    app.component(_OTable.name, _OTable);
  },
});

export * from './types';

export { OTable };
