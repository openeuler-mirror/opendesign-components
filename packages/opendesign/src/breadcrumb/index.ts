import type { App } from 'vue';

import _OBreadcrumb from './OBreadcrumb.vue';
import OBreadcrumbItem from './OBreadcrumbItem.vue';

const OBreadcrumb = Object.assign(_OBreadcrumb, {
  OBreadcrumbItem,
  install(app: App) {
    app.component('OBreadcrumb', _OBreadcrumb);
    app.component('OBreadcrumbItem', OBreadcrumbItem);
  },
});

export { OBreadcrumb, OBreadcrumbItem };
export * from './types';
