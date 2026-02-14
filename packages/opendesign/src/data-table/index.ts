import type { App } from 'vue';
import _ODataTable from './ODataTable.vue';
import { DataTableExposed } from './types.ts';

const ODataTable = Object.assign(_ODataTable, {
  install(app: App) {
    app.component('ODataTable', _ODataTable);
  },
});

export { ODataTable };
export * from './types';
export * from './provide';

export type DataTableInstance = InstanceType<typeof _ODataTable> & DataTableExposed;
