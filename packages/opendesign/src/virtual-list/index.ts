import type { App } from 'vue';

import _OVirtualList from './OVirtualList.vue';

const OVirtualList = Object.assign(_OVirtualList, {
  install(app: App) {
    app.component('OVirtualList', _OVirtualList);
  },
});

export { OVirtualList };
export * from './types';
