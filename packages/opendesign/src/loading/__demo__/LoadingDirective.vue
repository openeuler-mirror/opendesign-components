<script setup lang="ts">
import { markRaw, ref } from 'vue';
import { vLoading, type LoadingPropsT } from '../index';
import { OButton } from '../../button';
import { OIconAdd } from '../../icon-components';
import '../../button/style';

const loading1 = ref(false);
const loading2 = ref(false);
const loading3 = ref<Partial<LoadingPropsT> | boolean>({
  label: 'loading3',
  visible: true,
  icon: markRaw(OIconAdd),
  iconRotating: true,
});
const loading4 = ref(false);

const handleLoading2 = () => {
  loading2.value = !loading2.value;
  setTimeout(() => {
    loading2.value = !loading2.value;
  }, 2000);
};
const BoolLoading3 = () => {
  loading3.value = typeof loading3.value === 'boolean' ? !loading3.value : !loading3.value.visible;
};
const optionLoading3 = () => {
  loading3.value = {
    label: 'loading3',
    visible: typeof loading3.value === 'boolean' ? !loading3.value : !loading3.value.visible,
    icon: markRaw(OIconAdd),
    iconRotating: true,
  };
};
const changeLoading3Attr = () => {
  if (typeof loading3.value === 'boolean') {
    return;
  }
  loading3.value.label = `${loading3.value.label} 1`;
  loading3.value.visible = true;
};
</script>
<template>
  <h4>指令</h4>
  <div class="col">
    <OButton @click="loading1 = !loading1">loading1 {{ loading1 }}</OButton>
    <OButton v-loading.body="loading2" @click="handleLoading2">loading2 body {{ loading2 }}</OButton>
    <OButton @click="BoolLoading3">bool loading3</OButton>
    <OButton @click="optionLoading3">option loading3</OButton>
    <OButton :disabled="typeof loading3 === 'boolean'" @click="changeLoading3Attr">change loading3 attr</OButton>
    <OButton @click="loading4 = !loading4">not reactive {{ loading1 }}</OButton>
  </div>
  Math.random——点击change loading3 attr按钮时 random 不应改变: {{ Math.random() }}
  <section>
    <div v-loading="loading1" class="box">loading1</div>
    <div v-loading.nomask="loading1" class="box">loading1 nomask</div>
    <div v-loading="loading3" class="box">config</div>
    <div v-loading="{ visible: loading4, icon: OIconAdd, label: 'not reactive', iconRotating: true  }" class="box">not reactive</div>
  </section>
</template>
<style lang="scss" scoped>
.box {
  width: 500px;
  height: 300px;
  background-color: #edf;
  position: relative;
}
</style>
