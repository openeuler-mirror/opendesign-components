import type { App } from 'vue';

import _OBreadcrumb from './OBreadcrumb.vue';
import _OBreadcrumbItem from './OBreadcrumbItem.vue';

export * from './types';

const OBreadcrumb = Object.assign(_OBreadcrumb, {
  install(app: App) {
    app.component(_OBreadcrumb.name, _OBreadcrumb);
  },
});

const OBreadcrumbItem = Object.assign(_OBreadcrumbItem, {
  install(app: App) {
    app.component(_OBreadcrumbItem.name, _OBreadcrumbItem);
  },
});

export { OBreadcrumb, OBreadcrumbItem };
