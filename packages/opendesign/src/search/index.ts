import type { App } from 'vue';

import _OSearch from './OSearch.vue';

const OSearch = Object.assign(_OSearch, {
  install(app: App) {
    app.component('OSearch', _OSearch);
  },
});

export { OSearch };
export * from './types';
