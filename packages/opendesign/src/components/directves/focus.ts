import { ObjectDirective } from 'vue';

const vFocus: ObjectDirective = {
  mounted(el: HTMLElement) {
    el.focus();
  }
};

export {
  vFocus
};