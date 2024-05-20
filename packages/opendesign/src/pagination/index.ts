import _OPagination from './OPagination.vue';
import type { App } from 'vue';

const OPagination = Object.assign(_OPagination, {
  install(app: App) {
    app.component('OPagination', _OPagination);
  },
});

export { OPagination };
export * from './types';
