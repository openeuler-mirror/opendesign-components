import _OForm from './OForm.vue';
import OFormItem from './OFormItem.vue';
import type { App } from 'vue';

const OForm = Object.assign(_OForm, {
  OFormItem,
  install(app: App) {
    app.component('OForm', _OForm);
    app.component('OFormItem', OFormItem);
  },
});

export { OForm, OFormItem };
export * from './types';
export * from './provide';
