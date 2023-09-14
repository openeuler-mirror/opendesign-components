import _OOption from './OOption.vue';
import OOptionList from './OOptionList.vue';
import type { App } from 'vue';

const OOption = Object.assign(_OOption, {
  install(app: App) {
    app.component(_OOption.name, _OOption);
  },
});

export { OOption, OOptionList };
