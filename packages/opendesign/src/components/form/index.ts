import _OForm from './OForm.vue';
import type { App } from 'vue';

const OForm = Object.assign(_OForm, {
  install(app: App) {
    app.component(_OForm.name, _OForm);
  },
});
export { OForm };
