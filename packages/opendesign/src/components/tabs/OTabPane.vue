<script lang="ts">
import { defineComponent, getCurrentInstance, inject, reactive } from 'vue';
import { tabsInjectKey } from './provide';
import { tabPaneProps } from './types';

export default defineComponent({
  name: 'OTabs',
  props: tabPaneProps,
  setup(props, { slots, attrs }) {
    const tabsInjection = inject(tabsInjectKey, null);

    const instance = getCurrentInstance();

    if (instance?.uid) {
      const id = props.value || props.label || instance?.uid;

      tabsInjection?.addTabItem(
        id,
        reactive({
          value: id,
          label: props.label,
          lazy: tabsInjection.lazy || props.lazy,
          disabled: props.disabled,
          closable: props.closable,
          transition: props.transition,
          unmountOnHide: props.unmountOnHide,
          attrs: attrs,
          slots: slots,
        })
      );
    }
    return () => {};
  },
});
</script>
