import { ObjectDirective } from 'vue';

const vFocus: ObjectDirective = {
  mounted(el: HTMLElement) {
    console.log('focus');

    el.focus();
  }
};

export {
  vFocus
};