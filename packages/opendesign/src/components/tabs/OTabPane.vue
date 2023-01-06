<script lang="ts">
import { defineComponent, getCurrentInstance, inject, reactive } from 'vue';
import { tabsInjectKey } from './provide';

export default defineComponent({
  name: 'OTabs',
  props: {
    /**
     * 页签项的key
     */
    value: {
      type: [String, Number],
      default: undefined,
    },
    /**
     * 页签项的文本，如果不传，使用nav插槽或者value
     */
    label: {
      type: String,
      default: undefined,
    },
    /**
     * 是否在隐藏时卸载页签内容
     */
    unmountOnHide: {
      type: Boolean,
      default: false,
    },
    /**
     * 页签切换时过渡动画
     */
    transition: {
      type: String,
      default: 'o-fade-in-enter',
    },
    /**
     * 是否禁用选中该页签
     */
    disabled: {
      type: Boolean,
      default: false,
    },
    /**
     * 是否可以删除该页签
     */
    closable: {
      type: Boolean,
      default: false,
    },
    /**
     * 是否页签首次激活时再加载页签内容
     */
    lazy: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { slots, attrs }) {
    const tabsInjection = inject(tabsInjectKey);

    const instance = getCurrentInstance();

    if (instance?.uid) {
      const id = props.value || instance?.uid;

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
