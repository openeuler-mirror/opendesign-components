import _OOption from './OOption.vue';
import OOptionList from './OOptionList.vue';
import OOptionGroup from './OOptionGroup.vue';
import type { App } from 'vue';

const OOption = Object.assign(_OOption, {
  install(app: App) {
    app.component(_OOption.name, _OOption);
    app.component(OOptionGroup.name, OOptionGroup);
    app.component(OOptionList.name, OOptionList);
  },
});

export { OOption, OOptionList, OOptionGroup };
