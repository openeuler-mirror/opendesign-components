import _OForm from './OForm.vue';
import OFormItem from './OFormItem.vue';
import type { App } from 'vue';

const OForm = Object.assign(_OForm, {
  OFormItem,
  install(app: App) {
    app.component(_OForm.name, _OForm);
  },
});
export { OForm, OFormItem };
