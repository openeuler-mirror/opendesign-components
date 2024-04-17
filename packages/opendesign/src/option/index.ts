import _OOption from './OOption.vue';
import OOptionList from './OOptionList.vue';
import OOptionGroup from './OOptionGroup.vue';
import type { App } from 'vue';

const OOption = Object.assign(_OOption, {
  install(app: App) {
    app.component('OOption', _OOption);
    app.component('OOptionGroup', OOptionGroup);
  },
});

export { OOption, OOptionList, OOptionGroup };
export * from './types';
