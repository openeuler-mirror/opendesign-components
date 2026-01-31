import type { App } from 'vue';
import _ODataTable from './ODataTable.vue';

const ODataTable = Object.assign(_ODataTable, {
  install(app: App) {
    app.component('ODataTable', _ODataTable);
  },
});

export { ODataTable };
export * from './types';
export * from './provide';
